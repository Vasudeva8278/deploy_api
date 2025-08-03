const clientService = require("../services/clientService");
const Client = require("../models/ClientModel");

// Create a new client
const createClient = async (req, res) => {
  try {
    const { name, empid, email, details } = req.body;

    // Validate required fields
    if (!name || !empid || !email) {
      return res.status(400).json({
        success: false,
        message: "Name, empid, and email are required fields.",
      });
    }

    // Check if client with same empid already exists
    const existingClient = await Client.findOne({ empid });
    if (existingClient) {
      return res.status(409).json({
        success: false,
        message: "Client with this empid already exists.",
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
      empid,
      email,
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
    const { name, empid, email, details } = req.body;

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

    // Check if empid is being changed and if it already exists
    if (empid && empid !== existingClient.empid) {
      const empidExists = await Client.findOne({ empid, _id: { $ne: id } });
      if (empidExists) {
        return res.status(409).json({
          success: false,
          message: "Client with this empid already exists.",
        });
      }
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
    if (empid) updateData.empid = empid;
    if (email) updateData.email = email;
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
  getAllClients,
  getClientById,
  getClientDetails,
  updateClient,
  deleteClientById,
};
