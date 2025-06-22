const { User, Message, Chat } = require('../../models/mysql');
const { Op } = require('sequelize');

// Create a new chat
exports.createChat = async (req, res) => {
  let { userIds, isGroup, name, description } = req.body;
  const groupPhoto = req.file?.path;
  const creatorId = req.user?.id ?? req.user;

  console.log('Creating chat with data:', {
    userIds,
    isGroup,
    name,
    description,
    groupPhoto,
    creatorId
  });

  // Jika userIds dikirim sebagai string JSON (karena FormData), parse dulu
  if (typeof userIds === 'string') {
    try {
      userIds = JSON.parse(userIds);
    } catch {
      return res.status(400).json({ message: 'Invalid userIds format' });
    }
  }

  try {
    // ---- PRIVATE CHAT ----
    if (!isGroup || isGroup === 'false' || isGroup === false) {
      if (!userIds || userIds.length !== 1) {
        return res.status(400).json({ message: 'Private chat must have exactly one user ID' });
      }

      const targetId = userIds[0];

      // Pastikan kedua user valid dan eksis
      const users = await User.findAll({
        where: {
          id: { [Op.in]: [creatorId, targetId] }
        }
      });

      if (users.length < 2) {
        return res.status(404).json({ message: 'One or more users not found' });
      }

      // Cek apakah chat privat sudah ada
      const existingChats = await Chat.findAll({
        where: { isGroup: false },
        include: [{
          model: User,
          as: 'participants',
          where: { id: { [Op.in]: [creatorId, targetId] } },
          through: { attributes: [] }
        }]
      });

      // Hanya lanjut kalau benar-benar cuma 2 user dalam chat tersebut
      const existingChat = existingChats.find(chat => 
        chat.participants.length === 2 &&
        chat.participants.some(u => u.id === creatorId) &&
        chat.participants.some(u => u.id === targetId)
      );

      if (existingChat) {
        return res.status(200).json({ message: 'Chat already exists', chatId: existingChat.id });
      }

      // Buat chat baru
      const newChat = await Chat.create({ isGroup: false });
      await newChat.setParticipants([creatorId, targetId]);

      return res.status(201).json({ message: 'Private chat created', chatId: newChat.id });
    }

    // ---- GROUP CHAT ----
    const participants = [...new Set([...userIds, creatorId])];

    // Validasi user di DB
    const validUsers = await User.findAll({
      where: {
        id: { [Op.in]: participants }
      }
    });

    if (validUsers.length !== participants.length) {
      return res.status(404).json({ message: 'Some participants do not exist' });
    }

    // Buat chat grup
    const groupChat = await Chat.create({
      isGroup: true,
      name,
      description,
      groupPhoto
    });

    await groupChat.setParticipants(participants);
    await groupChat.setAdmins([creatorId]);

    return res.status(201).json({
      message: 'Group chat created',
      chatId: groupChat.id
    });

  } catch (error) {
    console.error('Create chat error:', error);
    return res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get chat details
exports.getChatDetail = async (req, res) => {
  const { chatId } = req.params;

  try {
    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    const chat = await Chat.findByPk(chatId, {
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'username', 'email'],
          through: { attributes: [] }
        },
        {
          model: Message,
          as: 'lastMessage'
        }
      ]
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Validate user is part of the chat
    const isParticipant = chat.participants.some(user => user.id.toString() === req.user.toString());
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    res.json({
      id: chat.id,
      isGroup: chat.isGroup,
      name: chat.isGroup ? chat.name : null,
      description: chat.isGroup ? chat.description : null,
      groupPhoto: chat.isGroup ? chat.groupPhoto : null,
      participants: chat.participants,
      lastMessage: chat.lastMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Get all chats for a user
exports.getAllChatsForUser = async (req, res) => {
  const userId = req.user;
  const { isGroup, sortBy = 'updatedAt', order = 'desc' } = req.query;

  try {
    const sort = {};
    sort[sortBy] = order === 'asc' ? 1 : -1;

    const userChats = await Chat.findAll({
      include: [{
        model: User,
        as: 'participants',
        where: { id: userId },
        attributes: [], // gak perlu ambil data user di sini
        through: { attributes: [] }
      }],
      attributes: ['id'],
      raw: true
    });

const chatIds = userChats.map(c => c.id);

    const where = {
      id: chatIds
    };
    if (isGroup === 'true') where.isGroup = true;
    if (isGroup === 'false') where.isGroup = false;

    const chats = await Chat.findAll({
      where,
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['id', 'username', 'email', 'profilePhoto'],
          through: { attributes: [] }
        },
        {
          model: Message,
          as: 'lastMessage'
        }
      ],
      order: [[sortBy, order.toUpperCase()]]
    });

    const formattedChats = chats.map(chat => {
      const otherUser = !chat.isGroup
        ? chat.participants.find(p => p.id !== userId)
        : null;

      return {
        id: chat.id,
        isGroup: chat.isGroup,
        name: chat.isGroup ? chat.name : otherUser?.username,
        groupPhoto: chat.isGroup ? chat.groupPhoto : otherUser?.profilePhoto,
        lastMessage: chat.lastMessage,
        participants: chat.participants.map(p => ({
          id: p.id,
          username: p.username,
          email: p.email,
          profilePhoto: p.profilePhoto
        })),
        updatedAt: chat.updatedAt
      };
    });

    res.json({ data: formattedChats });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Edit chat details
exports.editGroupChat = async (req, res) => {
  const { chatId } = req.params;
  const { name, description } = req.body;
  const groupPhoto = req.file?.path;
  const userId = req.user;

  try {
    const chat = await Chat.findByPk(chatId, {
      include: [
        { model: User, as: 'participants', through: { attributes: [] } },
        { model: User, as: 'admins', through: { attributes: [] } }
      ]
    });

    if (!chat || !chat.isGroup) {
      return res.status(400).json({ message: 'Chat not found or not a group chat' });
    }

    const isParticipant = chat.participants.some(u => u.id === userId);
    const isAdmin = chat.admins.some(u => u.id === userId);

    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant of this group' });
    }

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can edit group details' });
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
  const userId = req.user;

  try {
    const chat = await Chat.findByPk(chatId, {
      include: [{
        association: 'participants', // as: 'participants' di belongsToMany
        through: { attributes: [] }  // hide pivot
      }]
    });

    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    // Cek apakah user adalah peserta
    const isParticipant = chat.participants.some(user => user.id === userId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You do not have permission to delete this chat' });
    }

    // Hapus chat dan semua pesan terkait dalam transaksi
    await sequelize.transaction(async (t) => {
      await Message.destroy({ where: { chatId }, transaction: t });
      await chat.destroy({ transaction: t }); // akan otomatis hapus dari ChatParticipants dan ChatAdmins jika relasi diatur cascade
    });

    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Send message to chat
exports.sendMessage = async (req, res) => {
  const { chatId, content, type } = req.body;
  const media = req.file?.path;
  const senderId = req.user;

  try {
    // Validasi chat
    const chat = await Chat.findByPk(chatId, {
      include: [{
        model: User,
        as: 'participants',
        through: { attributes: [] }
      }]
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Validasi partisipasi
    const isParticipant = chat.participants.some(p => p.id === senderId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    // Buat pesan
    const message = await Message.create({
      chatId,
      senderId,
      content: type === 'text' ? content : '',
      media: type !== 'text' ? media : '',
      type
    });

    // Update lastMessage di chat
    await chat.update({ lastMessageId: message.id });

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
    const message = await Message.findByPk(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.senderId !== req.user) {
      return res.status(403).json({ message: 'Cannot edit someone else\'s message' });
    }

    await message.update({ content }); // updatedAt otomatis diupdate oleh Sequelize

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
    const chat = await Chat.findByPk(chatId, {
      include: [{
        model: User,
        as: 'participants',
        where: { id: req.user }, // check if user is a participant
        through: { attributes: [] }
      }]
    });

    if (!chat) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    // Fetch messages for the chat
    const messages = await Message.findAll({
      where: { chatId },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'email', 'username']
      }],
      order: [['createdAt', 'ASC']],
      offset: start,
      limit: limit > 0 ? limit : undefined
    });

    res.json({ data: messages });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Set message as delivered
exports.setMessageDelivered = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user;

  try {
    const message = await Message.findByPk(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    // Tambahkan ke relasi jika belum ada
    const deliveredUsers = await message.getDeliveredUsers({ where: { id: userId } });

    if (deliveredUsers.length === 0) {
      await message.addDeliveredUser(userId);
    }

    res.json({ message: 'Message marked as delivered' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
}

// Set message as read
exports.setMessageRead = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user;

  try {
    const message = await Message.findByPk(messageId, {
      include: [{
        model: User,
        as: 'sender',
        attributes: ['id', 'email', 'username', 'profilePhoto']
      }]
    });

    if (!message) return res.status(404).json({ message: 'Message not found' });

    const readUsers = await message.getReadUsers({ where: { id: userId } });

    if (readUsers.length === 0) {
      await message.addReadUser(userId);
    }

    res.json({ message: 'Message marked as read', message });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
}

// Delete message
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.user;

  try {
    const message = await Message.findByPk(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    if (message.senderId !== userId) {
      return res.status(403).json({ message: 'Cannot delete someone else\'s message' });
    }

    await message.destroy();
    res.json({ message: 'Message successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
