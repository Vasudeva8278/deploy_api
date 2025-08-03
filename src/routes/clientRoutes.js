const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");

// Debug: Check if clientController functions are defined
console.log("clientController loaded:", !!clientController);
console.log("createClient:", typeof clientController.createClient);
console.log("getAllClients:", typeof clientController.getAllClients);
console.log("getClientById:", typeof clientController.getClientById);
console.log("getClientDetails:", typeof clientController.getClientDetails);
console.log("updateClient:", typeof clientController.updateClient);
console.log("deleteClientById:", typeof clientController.deleteClientById);

// Create a new client
router.post("/", clientController.createClient);

// Get all clients
router.get("/", clientController.getAllClients);

// Get a single client by ID
router.get("/:id", clientController.getClientById);

// Get client details with documents
router.get("/:id/details", clientController.getClientDetails);

// Update a client by ID
router.put("/:id", clientController.updateClient);

// Delete a client by ID
router.delete("/:id", clientController.deleteClientById);

module.exports = router;
