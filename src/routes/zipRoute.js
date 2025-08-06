const express = require('express');
const router = express.Router();
const { zipFolderController } = require('../controllers/zipController');
const { auth } = require('../middleware/auth');

// Define the route for zipping a folder
router.get('/zip-folder', auth, zipFolderController);

module.exports = router;
