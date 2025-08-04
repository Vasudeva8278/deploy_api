const express = require("express");
const router = express.Router();

const {
  getOrganizations,
  getOrganization,
  createOrganization,
  approveOrganization,
  updateOrganization,
  deleteOrganization,
} = require("../controllers/organizationController");

const { auth, admin } = require("../middleware/auth");

// Routes
router.get("/", auth, admin, getOrganizations);
router.get("/:id", auth, admin, getOrganization);
router.post("/", createOrganization);
router.put("/approve/:id", auth, admin, approveOrganization);
router.put("/:id", auth, admin, updateOrganization);
router.delete("/:id", auth, admin, deleteOrganization);

module.exports = router;
