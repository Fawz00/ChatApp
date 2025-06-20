const User = require('../../models/mysql/User.js');
const Message = require('../../models/mysql/Message.js');
const Chat = require('../../models/mysql/Chat.js');
const { Op } = require('../../config/mysql/db.js');

const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    if (!username || username.length < 3)
      return res.status(400).json({ message: 'Username must be at least 3 characters long' });
    if (!password || password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: 'Email has already been registered' });
    
    const usernameExists = await User.findOne({ where: {username} });
    if (usernameExists)
      return res.status(400).json({ message: 'Username has already been taken' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword, username });

    res.status(201).json({ message: 'User registered successfully', email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ message: 'Email not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Password is incorrect' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    res.status(200).json({ token, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
    const html = `
      <h3>Reset Password</h3>
      <p>Klik link berikut untuk mengatur ulang password:</p>
      <a href="${link}">${link}</a>
      <p>Token: <strong>${token}</strong></p>
      <p>Jangan bagikan token ke siapapun!</p>
      <p>Link ini hanya berlaku selama 1 jam.</p>
    `;

    await sendEmail(user.email, 'Reset Password - Chat App', html);
    res.json({ message: 'Email has been sent to reset your password' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) return res.status(400).json({ message: 'Token invalid or expired' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getSelfProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const updates = {
      username: req.body.username,
      description: req.body.description,
      phoneNumber: req.body.phoneNumber,
    };

    if (req.files?.profilePhoto) {
      updates.profilePhoto = req.files.profilePhoto[0].path;
    }

    if (req.files?.bannerPhoto) {
      updates.bannerPhoto = req.files.bannerPhoto[0].path;
    }

    const user = await User.findByPk(req.user, {attributes: { exclude: ['password']}});
    await user.update(updates);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.deleteAccount = async (req, res) => {
  const userId = req.user;

  try {
    await sequelize.transaction(async (t) => {
      // Hapus user
      await User.destroy({ where: { id: userId }, transaction: t });

      // Hapus semua pesan dari user
      await Message.destroy({ where: { senderId: userId }, transaction: t });

      // Temukan semua chat privat (bukan grup) yang melibatkan user ini
      const privateChats = await Chat.findAll({
        where: { isGroup: false },
        include: [{
          model: User,
          as: 'participants',
          where: { id: userId }
        }],
        transaction: t
      });

      const privateChatIds = privateChats.map(chat => chat.id);

      // Hapus semua chat privat dan pesannya
      if (privateChatIds.length > 0) {
        await Chat.destroy({ where: { id: privateChatIds }, transaction: t });
        await Message.destroy({ where: { chatId: privateChatIds }, transaction: t });
      }

      // Keluarkan user dari semua grup (many-to-many unlink)
      // Pastikan tabel relasi many-to-many kamu: ChatParticipants, ChatAdmins
      await sequelize.models.ChatParticipants.destroy({
        where: { userId },
        transaction: t
      });

      await sequelize.models.ChatAdmins.destroy({
        where: { userId },
        transaction: t
      });
    });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.findUser = async (req, res) => {
  const { keywordInput } = req.params;

  try {
    const keyword = String(keywordInput || '');

    console.log('Searching for users with keyword:', keyword);

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { email: { [Op.like]: `%${keyword}%` } },
          { username: { [Op.like]: `%${keyword}%` } }
        ]
      },
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
