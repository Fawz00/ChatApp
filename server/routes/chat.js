const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  createChat,
  sendMessage,
  getMessages,
  getChatDetail,
  deleteChat,
  editMessage,
  deleteMessage,
  editGroupChat
} = require('../controllers/chatController');

// Chat
router.post('/create', auth, upload.single('groupPhoto'), createChat);
router.get('/:chatId', auth, getChatDetail);
router.put('/:chatId', auth, upload.single('groupPhoto'), editGroupChat);
router.delete('/:chatId', auth, deleteChat);

// Message
router.post('/send', auth, upload.single('media'), sendMessage);
router.get('/:chatId/messages', auth, getMessages);
router.put('/message/:messageId', auth, editMessage);
router.delete('/message/:messageId', auth, deleteMessage);

module.exports = router;
