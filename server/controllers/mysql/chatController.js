const User = require('../../models/mysql/User.js');
const Message = require('../../models/mysql/Message.js');
const Chat = require('../../models/mysql/Chat.js');
const { Op } = require('../../config/mysql/db.js');

// Create a new chat
exports.createChat = async (req, res) => {
  const { userIds, isGroup, name, description } = req.body;
  const groupPhoto = req.file?.path;
  const creator = req.user;

  try {
    if (!isGroup) {
      if (!userIds || userIds.length !== 1) {
        return res.status(400).json({ message: 'Private chat must have exactly one user ID' });
      }

      const targetId = userIds[0];

      // Check if the chat already exists
      const existingChat = await Chat.findOne({
        isGroup: false,
        participants: { $all: [creator, targetId], $size: 2 }
      });

      if (existingChat) {
        return res.status(200).json({ message: 'Chat already exists', chatId: existingChat._id });
      }

      // If no existing chat, create a new private chat
      const newChat = new Chat({
        isGroup: false,
        participants: [creator, targetId]
      });

      await newChat.save();
      return res.status(201).json({ message: 'Chat created successfully', chatId: newChat._id });
    }

    // Not a private chat, so it must be a group chat
    const uniqueParticipants = [...new Set([...userIds, creator])];

    const chat = new Chat({
      isGroup,
      name: isGroup ? name : undefined,
      description: isGroup ? description : undefined,
      groupPhoto: isGroup && groupPhoto ? groupPhoto : undefined,
      participants: uniqueParticipants,
      admins: isGroup ? [creator] : [] // creator is admin for group chats
    });

    await chat.save();
    res.status(201).json({ _id: chat._id, ...chat.toObject() });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get chat details
exports.getChatDetail = async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    const chat = await Chat.findById(chatId)
      .populate('participants', 'email')
      .populate('participants', 'username')
      .populate('lastMessage');

    if (!chat) {
      return res.status(404).json({ message: 'Chat tidak ditemukan' });
    }

    // Cek apakah user adalah peserta
    if (!chat.participants.some(u => u._id.toString() === req.user.toString())) {
      return res.status(403).json({ message: 'Anda tidak diizinkan mengakses chat ini' });
    }

    res.json(
      {
        _id: chat._id,
        isGroup: chat.isGroup,
        name: chat.isGroup ? chat.name : null,
        description: chat.isGroup ? chat.description : null,
        groupPhoto: chat.isGroup ? chat.groupPhoto : null,
        participants: chat.participants,
        lastMessage: chat.lastMessage
      }
  );
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get all chats for a user
exports.getAllChatsForUser = async (req, res) => {
  try {
    const userId = req.user;
    const { isGroup, sortBy = 'updatedAt', order = 'desc' } = req.query;

    const filter = { participants: userId };
    if (isGroup === 'true') filter.isGroup = true;
    if (isGroup === 'false') filter.isGroup = false;

    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const chats = await Chat.find(filter)
      .populate('participants', 'username email profilePhoto')
      .populate('lastMessage')
      .sort(sort);

    const formattedChats = chats.map(chat => {
      const otherUser = !chat.isGroup
        ? chat.participants.find(p => p._id.toString() !== userId.toString())
        : null;

      return {
        _id: chat._id,
        isGroup: chat.isGroup,
        name: chat.isGroup ? chat.name : otherUser?.username,
        photo: chat.isGroup ? chat.groupPhoto : otherUser?.profilePhoto,
        lastMessage: chat.lastMessage,
        participants: chat.participants.map(p => ({
          _id: p._id,
          username: p.username,
          email: p.email,
          profilePhoto: p.profilePhoto
        })),
        updatedAt: chat.updatedAt
      };
    });

    res.json(
      {
        data: formattedChats
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Edit chat details
exports.editGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const { name, description } = req.body;
  const groupPhoto = req.file?.path;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isGroup) {
      return res.status(400).json({ message: 'Chat not found or not a group chat' });
    }

    if (!chat.admins.includes(req.user.toString())) {
      return res.status(403).json({ message: 'Only admins can edit group details' });
    }

    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ message: 'You are not a participant of this group' });
    }

    if (name) chat.name = name;
    if (description) chat.description = description;
    if (groupPhoto) chat.groupPhoto = groupPhoto;

    await chat.save();
    res.json({ message: 'Group chat details updated successfully', chat });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Validasi user adalah peserta
    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ message: 'You do not have permission to delete this chat' });
    }

    await Chat.findOneAndDelete({ _id: chatId });
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Send message to chat
exports.sendMessage = async (req, res) => {
  const { chatId, content, type } = req.body;
  const media = req.file?.path;

  try {
    // Validate chat exists
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Validate user is part of the chat
    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    // Create new message
    const message = new Message({
      chatId,
      sender: req.user,
      content: type === 'text' ? content : '',
      media: type !== 'text' ? media : '',
      type
    });

    await message.save();

    // Update chat with last message
    chat.lastMessage = message._id;
    await chat.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Edit message
exports.editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Chat not found' });

    if (message.sender.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Cannot edit someone else\'s message' });
    }

    message.content = content;
    message.updatedAt = new Date();
    await message.save();

    res.json({ message: 'Chat message updated successfully', message });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get messages for a chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;
  const start = parseInt(req.query.start) || 0;
  const limit = parseInt(req.query.limit) || 0;

  try {
    // Validate chat exists and user is part of it
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    // Get messages for the chat
    let query = Message.find({ chatId })
      .populate('sender', 'email')
      .populate('sender', 'username')
      .sort('createdAt');

    if (limit > 0) {
      query = query.skip(start).limit(limit);
    }

    const messages = await query;

    res.json(
      {
        data: messages
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Set message as delivered
exports.setMessageDelivered = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (!message.isDelivered.includes(req.user.toString())) {
      message.isDelivered.push(req.user);
      await message.save();
    }
    res.json({ message: 'Message marked as delivered' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
}

// Set message as read
exports.setMessageRead = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message
      .findById(messageId)
      .populate('sender', 'email username profilePhoto');
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (!message.isRead.includes(req.user.toString())) {
      message.isRead.push(req.user);
      await message.save();
    }
    res.json({ message: 'Message marked as read', message });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
}

// Delete message
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.sender.toString() !== req.user.toString()) {
      return res.status(403).json({ message: 'Cannot delete someone else\'s message' });
    }

    await message.deleteOne();
    res.json({ message: 'Message successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
