const { Chat, Message, User } = require('../../models/mysql');
const sequelize = require('../../config/mysql/db');
const { Op } = require('sequelize');

const runCleanup = async (req, res) => {
  console.log('🧹 Menjalankan tugas pembersih otomatis...');

  // 1. Hapus chat yang cuma punya 1 orang
  const allChats = await Chat.findAll({
    include: [{
      model: User,
      as: 'participants',
      through: { attributes: [] }
    }]
  });

  for (const chat of allChats) {
    if (chat.participants.length < 2) {
      await chat.destroy();
      console.log(`🗑 Chat ${chat.id} dihapus karena hanya punya 1 peserta`);
    }
  }

  // 2. Hapus duplikat chat non-grup dengan peserta sama
  const privateChats = await Chat.findAll({
    where: { isGroup: false },
    include: [{
      model: User,
      as: 'participants',
      through: { attributes: [] }
    }]
  });

  const seenPairs = new Map(); // key = sorted pair string, value = chat id

  for (const chat of privateChats) {
    if (chat.participants.length !== 2) {
      continue;
    }

    const ids = chat.participants.map(p => p.id).sort();
    const key = ids.join('-');

    if (seenPairs.has(key)) {
      await chat.destroy();
      console.log(`🗑 Duplikat chat privat ${chat.id} dihapus, pasangan: ${key}`);
    } else {
      seenPairs.set(key, chat.id);
    }
  }

  // 3. Hapus message dengan pengirim yang tidak ada
  await Message.destroy({
    where: {
      senderId: {
        [Op.notIn]: sequelize.literal('(SELECT id FROM Users)')
      }
    }
  });

  console.log('🗑 Pesan dari user yang tidak valid telah dihapus');

  // 4. Hapus message dari chat yang sudah dihapus
  await Message.destroy({
    where: {
      chatId: {
        [Op.notIn]: sequelize.literal('(SELECT id FROM Chats)')
      }
    }
  });

  console.log('🗑 Pesan dari chat yang sudah tidak ada telah dihapus');

  console.log('✅ Pembersihan selesai');
  res.status(200).json({ message: 'OK!' });
};

module.exports = runCleanup;
