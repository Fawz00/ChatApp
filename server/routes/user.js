const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  getProfile,
  editProfile,
  deleteAccount
} = require('../controllers/authController');

router.get('/me', auth, getProfile);

router.put(
  '/me',
  auth,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'bannerPhoto', maxCount: 1 }
  ]),
  editProfile
);

router.delete('/me', auth, deleteAccount);

module.exports = router;