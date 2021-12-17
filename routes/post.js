const express = require('express')

const { uploadImage, postPublication, removeImage, getPublications } = require('../controllers/post')
const { authCheck } = require('../middlewares/auth');

const router = express.Router();

router.post('/uploadimages', authCheck, uploadImage);
router.post('/postPublication', authCheck, postPublication);
router.post('/postDeletePublication', authCheck, removeImage);
router.get('/getPublications', authCheck, getPublications);

module.exports = router;
