const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage(); // Or configure for file storage on disk/cloud
const upload = multer({ 
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
const {
  createAndUpdateProfile,
  getProfile,
} = require("../controllers/profileController");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File size too large. Maximum size is 4MB." });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: "Only image files are allowed!" });
  }
  next(err);
};

// Route for creating a profile
router.post("/", auth, upload.single("profilePic"), handleMulterError, createAndUpdateProfile);

// Route for getting a profile by userId
router.get("/", auth, getProfile);

module.exports = router;
