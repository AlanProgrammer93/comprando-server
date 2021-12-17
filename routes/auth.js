const express = require('express')

const { register, currentUser, login } = require('../controllers/auth')
const { authCheck } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/current-user', authCheck, currentUser);

module.exports = router;
