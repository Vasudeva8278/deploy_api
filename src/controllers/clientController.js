const clientService = require("../services/clientService");
const Client = require("../models/ClientModel");

// Create a new client
const createClient = async (req, res) => {
  try {
    const { name, email, phone_number, details } = req.body;

    // Validate required fields
    if (!name || !email || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone_number are required fields.",
      });
    }

    // Check if client with same email already exists
    const existingEmail = await Client.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Client with this email already exists.",
      });
    }

    const newClient = new Client({
      name,
      email,
      phone_number,
      details: details || [],
    });

    const savedClient = await newClient.save();

    res.status(201).json({
      success: true,
      message: "Client created successfully.",
      data: savedClient,
    });
  } catch (error) {
    console.error("Error creating client:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the client.",
    });
  }
};

// Update client email and phone_number
const updateClientEmailPhone = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone_number } = req.body;

    console.log("=== updateClientEmailPhone DEBUG ===");
    console.log("Request body:", req.body);
    console.log("Extracted email:", email);
    console.log("Extracted phone_number:", phone_number);
    console.log("email type:", typeof email);
    console.log("phone_number type:", typeof phone_number);
    console.log("email truthy:", !!email);
    console.log("phone_number truthy:", !!phone_number);
    console.log("=== END DEBUG ===");

    // Validate required fields
    if (!email || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Email and phone_number are required fields.",
      });
    }

    const updatedClient = await clientService.updateClientEmailPhone(id, email, phone_number);

    res.status(200).json({
      success: true,
      message: "Client email and phone_number updated successfully.",
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client email and phone_number:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating the client.",
    });
  }
};

// Fetch all clients with details
const getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClientsWithDetails();
    res.status(200).json({
      success: true,
      message: "Clients fetched successfully.",
      data: clients,
    });
  } catch (error) {
    console.error("Error fetching clients:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching clients.",
    });
  }
};

// Fetch a single client by ID
const getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required.",
      });
    }

    const client = await Client.findById(id);

    // Check if client exists
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client fetched successfully.",
      data: client,
    });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the client.",
    });
  }
};

// Fetch details for a specific client by ID
const getClientDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required.",
      });
    }

    const clients = await clientService.getDocumentsByClientId(id);

    // Check if client exists
    if (!clients || clients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client details fetched successfully.",
      data: clients,
    });
  } catch (error) {
    console.error("Error fetching client details:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching client details.",
    });
  }
};

// Update a client by ID
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number, details } = req.body;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required.",
      });
    }

    // Check if client exists
    const existingClient = await Client.findById(id);
    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found.",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingClient.email) {
      const emailExists = await Client.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Client with this email already exists.",
        });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone_number) updateData.phone_number = phone_number;
    if (details) updateData.details = details;

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Client updated successfully.",
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the client.",
    });
  }
};

// Delete a client by ID
const deleteClientById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required.",
      });
    }
    const deleted = await clientService.deleteClientById(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Client not found or already deleted.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Client deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting client:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the client.",
    });
  }
};

module.exports = {
  createClient,
  updateClientEmailPhone,
  getAllClients,
  getClientById,
  getClientDetails,
  updateClient,
  deleteClientById,
};
