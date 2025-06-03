const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Buat chat baru
exports.createChat = async (req, res) => {
  const { userIds, isGroup, name } = req.body;

  try {
    const chat = new Chat({
      isGroup,
      name: isGroup ? name : undefined,
      participants: [...new Set([...userIds, req.user])]
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Kirim pesan
exports.sendMessage = async (req, res) => {
  const { chatId, content, type } = req.body;
  const media = req.file?.path;

  try {
    const message = new Message({
      chat: chatId,
      sender: req.user,
      content: type === 'text' ? content : '',
      media: type !== 'text' ? media : '',
      type
    });

    await message.save();
    await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Ambil semua pesan di chat
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'email')
      .sort('createdAt');

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
