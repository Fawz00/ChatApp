const { User, Message, Chat, Notification } = require('../../models/mysql');
const sequelize = require('../../config/mysql/db');
const { sendSocketNotification } = require('../../socket');
const { Op } = require('sequelize');

// Create a new chat
exports.createChat = async (req, res) => {
  let { userIds, isGroup, name, description } = req.body;
  const groupPhoto = req.file?.path;
  const creatorId = req.user?.id ?? req.user;

  // If userIds is a string, try to parse it as JSON
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

      // Make sure creatorId and targetId are different
      const users = await User.findAll({
        where: {
          id: { [Op.in]: [creatorId, targetId] }
        }
      });

      if (users.length < 2) {
        return res.status(404).json({ message: 'One or more users not found' });
      }

      // Check if chat already exists
      const existingChats = await Chat.findAll({
        where: { isGroup: false },
        include: [{
          model: User,
          as: 'participants',
          where: { id: { [Op.in]: [creatorId, targetId] } },
          through: { attributes: [] }
        }]
      });

      // Continue if chat already exists
      const existingChat = existingChats.find(chat => 
        chat.participants.length === 2 &&
        chat.participants.some(u => u.id === creatorId) &&
        chat.participants.some(u => u.id === targetId)
      );

      if (existingChat) {
        return res.status(200).json({ message: 'Chat already exists', chatId: existingChat.id });
      }

      // Create new private chat
      const newChat = await Chat.create({ isGroup: false });
      await newChat.setParticipants([creatorId, targetId]);

      // Send socket notification to other user
      const notification = {
        type: 'added_to_chat',
        chatId: newChat.id
      };
      sendSocketNotification(targetId, notification);

      return res.status(201).json({ message: 'Private chat created', chatId: newChat.id });
    }

    // ---- GROUP CHAT ----
    const participants = [...new Set([...userIds, creatorId])];

    // Validate participants
    const validUsers = await User.findAll({
      where: {
        id: { [Op.in]: participants }
      }
    });

    if (validUsers.length !== participants.length) {
      return res.status(404).json({ message: 'Some participants do not exist' });
    }

    // Create group chat
    const groupChat = await Chat.create({
      isGroup: true,
      name,
      description,
      groupPhoto
    });

    await groupChat.setParticipants(participants);
    await groupChat.setAdmins([creatorId]);

    // Create notification for each participant
    const notification = {
      type: 'added_to_chat',
      chatId: groupChat.id
    };
    for (const _userId of userIds) {
      sendSocketNotification(_userId, notification);
    }

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
          attributes: ['id', 'username', 'description', 'email', 'profilePhoto'], // Tambahkan profilePhoto
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'admins',
          attributes: ['id', 'username', 'description', 'email', 'profilePhoto'], // Ambil juga profilePhoto
          through: { attributes: [] }
        },
        {
          model: Message,
          as: 'lastMessage',
          include: [{
            model: User,
            as: 'sender',
            attributes: ['id', 'username', 'profilePhoto']
          }]
        }
      ]
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Validasi apakah user adalah partisipan dari chat
    const isParticipant = chat.participants.some(user =>
      user.id.toString() === req.user.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    // Format respons untuk frontend
    res.json({
      id: chat.id,
      isGroup: chat.isGroup,
      name: chat.isGroup ? chat.name : chat.participants.find(p => p.id !== req.user)?.username || 'Unknown User',
      description: chat.isGroup ? chat.description : null,
      groupPhoto: chat.isGroup ? chat.groupPhoto : null,
      participants: chat.participants.map(participant => ({
        id: participant.id,
        username: participant.username,
        description: participant.description,
        email: participant.email,
        profilePhoto: participant.profilePhoto
      })),
      admins: chat.admins.map(admin => ({
        id: admin.id,
        username: admin.username,
        description: admin.description,
        email: admin.email,
        profilePhoto: admin.profilePhoto
      })),
      lastMessage: chat.lastMessage ? {
        id: chat.lastMessage.id,
        content: chat.lastMessage.content,
        type: chat.lastMessage.type,
        senderId: chat.lastMessage.senderId,
        sender: chat.lastMessage.sender ? {
          id: chat.lastMessage.sender.id,
          username: chat.lastMessage.sender.username,
          profilePhoto: chat.lastMessage.sender.profilePhoto
        } : null,
        createdAt: chat.lastMessage.createdAt
      } : null,
      updatedAt: chat.updatedAt
    });

  } catch (error) {
    console.error('Error fetching chat details:', error);
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
  let {
    name,
    description,
    addParticipants,
    removeParticipants,
    addAdmins,
    removeAdmins
  } = req.body;
  const groupPhoto = req.file?.path;
  const userId = req.user;
  
  if (typeof addAdmins === 'string') addAdmins = JSON.parse(addAdmins);
  if (typeof removeAdmins === 'string') removeAdmins = JSON.parse(removeAdmins);
  if (typeof addParticipants === 'string') addParticipants = JSON.parse(addParticipants);
  if (typeof removeParticipants === 'string') removeParticipants = JSON.parse(removeParticipants);

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

    // Update variables

    if (name) chat.name = name;
    if (description) chat.description = description;
    if (groupPhoto) chat.groupPhoto = groupPhoto;

    // Add participants
    if (Array.isArray(addParticipants) && addParticipants.length > 0) {
      await chat.addParticipants(addParticipants);
    }

    // Remove participants or admins
    if (Array.isArray(removeParticipants) && removeParticipants.length > 0) {
      await chat.removeParticipants(removeParticipants);
      await chat.removeAdmins(removeParticipants);
    }

    // Add admins
    if (Array.isArray(addAdmins) && addAdmins.length > 0) {
      await chat.addAdmins(addAdmins);
    }

    // Remove admins
    if (Array.isArray(removeAdmins) && removeAdmins.length > 0) {
      await chat.removeAdmins(removeAdmins);

      // Make sure at least one admin remains
      const adminsLeft = await chat.getAdmins();
      if (adminsLeft.length === 0) {
        return res.status(400).json({ message: 'Cannot remove all admins — at least one admin must remain.' });
      }
    }

    await chat.save();

    const updatedChat = await Chat.findByPk(chatId, {
      include: [
        { model: User, as: 'participants', attributes: ['id', 'username', 'email', 'profilePhoto'], through: { attributes: [] } },
        { model: User, as: 'admins', attributes: ['id'], through: { attributes: [] } }
      ]
    });

    res.json({ message: 'Group chat details updated successfully', updatedChat });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Leave group chat
exports.leaveGroupChat = async (req, res) => {
  const userId = typeof req.user === 'object' ? req.user.id : req.user;
  const { chatId } = req.params;

  try {
    // Fetch chat with participants and admins
    const chat = await Chat.findByPk(chatId, {
      include: [
        { association: 'participants', through: { attributes: [] } },
        { association: 'admins', through: { attributes: [] } }
      ]
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.isGroup) {
      return res.status(400).json({ message: 'This is not a group chat, you cannot leave it' });
    }

    // Validate if user is a participant or admin
    const isParticipant = chat.participants.some(p => p.id === userId);
    const isAdmin = chat.admins.some(a => a.id === userId);
    if (!isParticipant && !isAdmin) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    // If user is the only admin, prevent leaving
    const isOnlyAdmin = chat.admins.length === 1 && chat.admins[0].id === userId;
    if (isOnlyAdmin && chat.participants.length > 1) {
      return res.status(400).json({
        message: 'You cannot leave the group chat as you are the only admin. Please assign another admin first.'
      });
    }

    // Remove user from participants
    await chat.removeParticipant(userId);
    await chat.removeAdmin(userId);

    // If user was an admin, check if there are still admins left
    const remaining = await chat.getParticipants();
    if (remaining.length === 0) {

      // Remove chat and all messages in a transaction
      await sequelize.transaction(async (t) => {
        // Remove all messages in the chat
        await Message.destroy({
          where: { chatId },
          transaction: t
        });

        // Remove the chat itself
        await chat.destroy({ transaction: t });
      });
      return res.json({ message: 'Group chat deleted as you were the last participant' });
    }

    res.json({ message: 'You have left the group chat successfully' });
  } catch (error) {
    console.error('Error leaving group chat:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user;

  try {
    const chat = await Chat.findByPk(chatId, {
      include: [
        {
          association: 'participants',
          through: { attributes: [] }
        },
        {
          association: 'admins',
          through: { attributes: [] }
        }
      ]
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Validate if user is an admin
    const isAdmin = chat.admins.some(user => user.id === userId);
    if (!isAdmin && chat.isGroup) {
      return res.status(403).json({ message: 'You do not have permission to delete this chat' });
    }

    // Notify all participants and admins before deletion
    const allUserIds = [
      ...chat.participants.map(p => p.id),
      ...chat.admins.map(a => a.id)
    ].filter((value, index, self) => self.indexOf(value) === index);

    // Remove chat and all messages in a transaction
    await sequelize.transaction(async (t) => {
      // Remove all messages in the chat
      await Message.destroy({
        where: { chatId },
        transaction: t
      });

      // Remove the chat itself
      await chat.destroy({ transaction: t });
    });

    // Send socket notification to all participants and admins
    const notification = {
      type: 'chat_deleted',
      chatId,
      timestamp: new Date()
    };

    for (const _userId of allUserIds) {
      sendSocketNotification(_userId, notification);
    }

    res.json({ message: 'Chat and all messages deleted successfully' });

  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ message: `Server error: ${error}` });
  }
};

// Send message to chat
exports.sendMessage = async (req, res) => {
  const { chatId, content, type } = req.body;
  const media = req.file?.path;
  const senderId = req.user;

  try {
    // Validate input
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

    // Validate participant
    const isParticipant = chat.participants.some(p => p.id === senderId);
    if (!isParticipant) {
      return res.status(403).json({ message: 'You are not a participant of this chat' });
    }

    // Create message
    const message = await Message.create({
      chatId,
      senderId,
      content: type === 'text' ? content : '',
      media: type !== 'text' ? media : '',
      type
    });

    // Update lastMessageId in chat
    await chat.update({ lastMessageId: message.id });

    // Create notification for each participant
    const chatParticipants = await chat.getParticipants({ attributes: ['id'] });
    const ChatAdmins = await chat.getAdmins({ attributes: ['id'] });
    const userIds = chatParticipants.map(p => p.id).concat(ChatAdmins.map(a => a.id));

    const notification = {
      type: 'new_message',
      chatId,
      messageId: message.id,
    };
    for (const _userId of userIds) {
      sendSocketNotification(_userId, notification);
    }

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
