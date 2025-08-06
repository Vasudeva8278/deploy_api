const express = require('express');
const router = express.Router();
const {
  getAllActivityLogs,
  getOrgActivityLogs,
} = require('../controllers/activityLogController');
const { auth } = require('../middleware/auth');

// Get all activity logs
router.get('/all', auth, getAllActivityLogs);

// Get activity logs for a specific organization
router.get('/org', auth, getOrgActivityLogs);

module.exports = router;
