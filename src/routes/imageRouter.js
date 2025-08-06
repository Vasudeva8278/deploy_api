const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController')
const { auth  } = require('../middleware/auth'); 

router.post('/uploadImage',auth,imageController.uploadImage)

router.get('/:imageName', auth, imageController.getImage);

module.exports = router;