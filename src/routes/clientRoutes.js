const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController"); // Replace with actual path

// Debug: Check if clientController functions are defined
console.log("clientController loaded:", !!clientController);
console.log("getAllClients:", typeof clientController.getAllClients);
console.log("getClientDetails:", typeof clientController.getClientDetails);
console.log("deleteClientById:", typeof clientController.deleteClientById);

// Route to fetch all clients with populated data
router.get("/", clientController.getAllClients);

router.get("/:id", clientController.getClientDetails);

router.delete("/:id", clientController.deleteClientById);

module.exports = router;
