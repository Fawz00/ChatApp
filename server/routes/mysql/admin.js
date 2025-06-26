const express = require('express');
const runCleanup = require('../../controllers/mysql/admin');

const router = express.Router();

router.post('/clean', runCleanup);

module.exports = router;
