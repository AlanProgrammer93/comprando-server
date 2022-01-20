const express = require('express')

const { getMessages } = require('../controllers/message')
const { authCheck } = require('../middlewares/auth');

const router = express.Router();

router.get('/get-messages', authCheck, getMessages);

module.exports = router;
