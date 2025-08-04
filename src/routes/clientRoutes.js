const express = require("express");
const router = express.Router();

const clientController = require("../controllers/clientController");

const {
  createClient,
  updateClientEmailPhone,
  getAllClients,
  getClientById,
  getClientDetails,
  updateClient,
  deleteClientById,
} = clientController;

const { auth, admin, orgAdmin } = require("../middleware/auth");

// Routes
router.post("/", auth, createClient);
router.get("/", auth, getAllClients);
router.get("/:id", auth, getClientById);
router.get("/details/:id", auth, getClientDetails);
router.put("/:id", auth, updateClient);
router.put("/contact/:id", auth, updateClientEmailPhone);
router.delete("/:id", auth, deleteClientById);

module.exports = router;
