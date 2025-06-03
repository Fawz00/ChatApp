const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const {
  createChat,
  sendMessage,
  getMessages
} = require('../controllers/chatController');

// Create chat (group atau private)
router.post('/create', auth, createChat);

// Kirim pesan (bisa teks atau media)
router.post('/send', auth, upload.single('media'), sendMessage);

// Get messages
router.get('/:chatId/messages', auth, getMessages);

module.exports = router;
