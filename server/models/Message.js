const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  media: String, // URL or file path
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  isDelivered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isRead: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
