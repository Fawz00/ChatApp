const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  getSelfProfile,
  getUserProfile,
  editProfile,
  deleteAccount,
  findUser
} = require('../controllers/authController');

router.get('/me', auth, getSelfProfile);
router.get('/:userId', auth, getUserProfile);

router.put(
  '/update',
  auth,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'bannerPhoto', maxCount: 1 }
  ]),
  editProfile
);

router.delete('/delete', auth, deleteAccount);
router.get('/find/:keywordInput', auth, findUser);


module.exports = router;