const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  getSelfProfile,
  getUserProfile,
  editProfile,
  deleteAccount
} = require('../controllers/authController');

router.get('/:userid', auth, getUserProfile);
router.get('/me', auth, getSelfProfile);

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