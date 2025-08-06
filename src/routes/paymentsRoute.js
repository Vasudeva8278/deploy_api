const express = require('express');
const router = express.Router();
const { getPayments, createPayment } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

// Get all payments for an organization
router.get('/:orgId', auth, getPayments);

// Create a new payment record
router.post('/', auth, createPayment);

module.exports = router;
