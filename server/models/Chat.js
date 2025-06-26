const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  isGroup: { type: Boolean, default: false },
  name: String,
  description: String,
  groupPhoto: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
}, { timestamps: true });

ChatSchema.pre('findOneAndDelete', async function (next) {
  const chatId = this.getQuery()['_id'];
  await mongoose.model('Message').deleteMany({ chat: chatId });
  next();
});

module.exports = mongoose.model('Chat', ChatSchema);
