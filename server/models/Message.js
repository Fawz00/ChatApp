const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  media: String, // URL or file path
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  isDelivered: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isRead: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  sceduledAt: {type: Date, required: false},
}, { timestamps: true });

// Tambahan fungsi static
MessageSchema.statics.markAsDelivered = async function (messageId, userId) {
  return this.findByIdAndUpdate(
    messageId,
    { $addToSet: { isDelivered: userId } },
    { new: true }
  );
};

MessageSchema.statics.markMessagesAsRead = async function (messageIds, userId) {
  return this.updateMany(
    { _id: { $in: messageIds } },
    { $addToSet: { isRead: userId } }
  );
};

module.exports = mongoose.model('Message', MessageSchema);
