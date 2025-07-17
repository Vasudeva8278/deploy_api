const express = require('express');
const router = express.Router();
const {
  getOrganizations,
  getOrganization,
  createOrganization,
  approveOrganization,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizationController');

// Debug: Check if organizationController functions are defined
console.log("organizationController functions:");
console.log("getOrganizations:", typeof getOrganizations);
console.log("getOrganization:", typeof getOrganization);
console.log("createOrganization:", typeof createOrganization);
console.log("approveOrganization:", typeof approveOrganization);
console.log("updateOrganization:", typeof updateOrganization);
console.log("deleteOrganization:", typeof deleteOrganization);

const { auth, admin } = require('../middleware/auth');

// Debug: Check if middleware functions are defined
console.log("auth middleware:", typeof auth);
console.log("admin middleware:", typeof admin);

// Get all organizations
router.get('/', auth, getOrganizations);

// Get a specific organization
router.get('/:id', auth, getOrganization);

// Create a new organization (SuperAdmin only)
router.post('/', auth, admin, createOrganization);

// Approve an organization (SuperAdmin only)
router.put('/:id/approve', auth, admin, approveOrganization);

// Update an organization
router.put('/:id', auth, admin, updateOrganization);

// Soft delete an organization
router.delete('/:id', auth, admin, deleteOrganization);

module.exports = router;
