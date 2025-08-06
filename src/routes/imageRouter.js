const express = require('express');
const multer = require('multer');
const router = express.Router();
const imageController = require('../controllers/imageController')
const { auth  } = require('../middleware/auth'); 

// Configure multer for image uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fieldSize: 4 * 1024 * 1024 } // 4MB limit for images
});

router.post('/uploadImage', auth, upload.single("image"), imageController.uploadImage)

router.get('/:imageName', auth, imageController.getImage);

module.exports = router;