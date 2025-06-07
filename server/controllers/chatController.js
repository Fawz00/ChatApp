const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create a new chat
exports.createChat = async (req, res) => {
  const { userIds, isGroup, name, description } = req.body;
  const groupPhoto = req.file?.path;

  const creator = req.user;

  try {
    const uniqueParticipants = [...new Set([...userIds, creator])];

    const chat = new Chat({
      isGroup,
      name: isGroup ? name : undefined,
      description: isGroup ? description : undefined,
      groupPhoto: isGroup && groupPhoto ? groupPhoto : undefined,
      participants: uniqueParticipants,
      admins: isGroup ? [creator] : [] // creator adalah admin pertama
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get chat details
exports.getChatDetail = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId)
      .populate('participants', 'email') // tambahkan fields lain sesuai user model
      .populate('lastMessage');

    if (!chat) {
      return res.status(404).json({ msg: 'Chat tidak ditemukan' });
    }

    // Cek apakah user adalah peserta
    if (!chat.participants.some(u => u._id.toString() === req.user.toString())) {
      return res.status(403).json({ msg: 'Anda tidak diizinkan mengakses chat ini' });
    }

    res.json({
      _id: chat._id,
      isGroup: chat.isGroup,
      name: chat.isGroup ? chat.name : null,
      description: chat.isGroup ? chat.description : null,
      groupPhoto: chat.isGroup ? chat.groupPhoto : null,
      participants: chat.participants,
      lastMessage: chat.lastMessage
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
      return res.status(400).json({ msg: 'Chat tidak valid atau bukan grup' });
    }

    if (!chat.admins.includes(req.user.toString())) {
      return res.status(403).json({ msg: 'Hanya admin yang boleh mengedit grup' });
    }

    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ msg: 'Anda bukan anggota grup ini' });
    }

    if (name) chat.name = name;
    if (description) chat.description = description;
    if (groupPhoto) chat.groupPhoto = groupPhoto;

    await chat.save();
    res.json({ msg: 'Grup berhasil diperbarui', chat });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete chat
exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ msg: 'Chat tidak ditemukan' });

    // Validasi user adalah peserta
    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ msg: 'Anda tidak bisa menghapus chat ini' });
    }

    await Chat.findOneAndDelete({ _id: chatId });
    res.json({ msg: 'Chat dan semua pesan terkait telah dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error' );
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
      return res.status(404).json({ msg: 'Chat tidak ditemukan atau telah dihapus' });
    }

    // Validate user is part of the chat
    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ msg: 'Anda tidak memiliki akses ke chat ini' });
    }

    // Create new message
    const message = new Message({
      chat: chatId,
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
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Edit message
exports.editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ msg: 'Pesan tidak ditemukan' });

    if (message.sender.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: 'Tidak boleh mengedit pesan orang lain' });
    }

    message.content = content;
    message.updatedAt = new Date();
    await message.save();

    res.json({ msg: 'Pesan berhasil diubah', message });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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
      return res.status(404).json({ msg: 'Chat tidak ditemukan' });
    }

    if (!chat.participants.includes(req.user.toString())) {
      return res.status(403).json({ msg: 'Anda tidak diizinkan melihat pesan chat ini' });
    }

    // Get messages for the chat
    let query = Message.find({ chat: chatId })
      .populate('sender', 'email')
      .sort('createdAt');

    if (limit > 0) {
      query = query.skip(start).limit(limit);
    }

    const messages = await query;

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ msg: 'Pesan tidak ditemukan' });

    if (message.sender.toString() !== req.user.toString()) {
      return res.status(403).json({ msg: 'Tidak boleh menghapus pesan orang lain' });
    }

    await message.deleteOne();
    res.json({ msg: 'Pesan berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
