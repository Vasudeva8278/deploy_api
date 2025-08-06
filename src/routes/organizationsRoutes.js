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

const { auth } = require("../middleware/auth");

// Routes
router.get("/", auth, getOrganizations);
router.get("/:id", auth, getOrganization);
router.post("/", auth, createOrganization);
router.put("/approve/:id", auth, approveOrganization);
router.put("/:id", auth, updateOrganization);
router.delete("/:id", auth, deleteOrganization);

module.exports = router;
