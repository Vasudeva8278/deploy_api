const Client = require("../models/ClientModel");

const getDocumentsByClientId = async (clientId) => {
  if (!clientId) {
    throw new Error("Client ID is required.");
  }

  const client = await Client.findById(clientId).populate({
    path: "documents",
    select: "fileName templateId",
    populate: {
      path: "templateId",
      select: "fileName projectId",
      populate: {
        path: "projectId",
        select: "projectName",
      },
    },
  });

  if (!client) {
    throw new Error("Client not found.");
  }

  return client;
};

const getAllClientsWithDetails = async () => {
  const clients = await Client.find()
    .select("_id name email phone_number documents")
    .populate({
      path: "documents",
      select: "fileName templateId",
      populate: {
        path: "templateId",
        select: "fileName projectId",
        populate: {
          path: "projectId",
          select: "projectName",
        },
      },
    });

  return clients;
};

// Update existing clients with proper email and phone_number
const updateClientEmailPhone = async (clientId, email, phone_number) => {
  if (!clientId || !email || !phone_number) {
    throw new Error("Client ID, email, and phone_number are required.");
  }

  // Check if email already exists for another client
  const existingEmail = await Client.findOne({ email, _id: { $ne: clientId } });
  if (existingEmail) {
    throw new Error("Client with this email already exists.");
  }

  const updatedClient = await Client.findByIdAndUpdate(
    clientId,
    { email, phone_number },
    { new: true, runValidators: true }
  );

  if (!updatedClient) {
    throw new Error("Client not found.");
  }

  return updatedClient;
};

/*this method creates  if clientName not found in db
 * or updates client,  like adding new document for template
 * and adding new labels if not already existing in details.
 */
const createOrUpdateClientDocument = async (
  clientName,
  templateId,
  documentId,
  highlights,
  email = null,
  phone_number = null
) => {
  console.log("=== createOrUpdateClientDocument CALLED ===");
  console.log("clientName:", clientName);
  console.log("templateId:", templateId);
  console.log("documentId:", documentId);
  console.log("highlights count:", highlights ? highlights.length : 0);
  console.log("email parameter:", email);
  console.log("phone_number parameter:", phone_number);
  console.log("email type:", typeof email);
  console.log("phone_number type:", typeof phone_number);
  console.log("email is null/undefined:", email == null);
  console.log("phone_number is null/undefined:", phone_number == null);
  
  if (!clientName || !templateId || !documentId) {
    throw new Error(
      "Missing required fields: clientName, templateId, or documentId."
    );
  }

  let client = await Client.findOne({ name: clientName });
  console.log("Existing client found:", client ? "Yes" : "No");

  if (!client) {
    // Use provided email and phone_number, or generate defaults if not provided
    const finalEmail = email || `client_${Date.now()}@system.generated`;
    const finalPhoneNumber = phone_number || `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    
    console.log("=== CREATING NEW CLIENT ===");
    console.log("finalEmail:", finalEmail);
    console.log("finalPhoneNumber:", finalPhoneNumber);
    console.log("email was provided:", !!email);
    console.log("phone_number was provided:", !!phone_number);
    console.log("=== END NEW CLIENT DATA ===");
    
    client = new Client({
      name: clientName,
      email: finalEmail,
      phone_number: finalPhoneNumber,
      documents: [{ templateId, documentId }],
      details: highlights.map((highlight) => ({
        label: highlight.label,
        value: highlight.text,
      })),
    });
    await client.save();
    console.log("New client created successfully with email:", client.email, "and phone_number:", client.phone_number);
    return client;
  }

  console.log("=== UPDATING EXISTING CLIENT ===");
  const existingDocument = client.documents.find(
    (doc) => doc.templateId.toString() === templateId.toString()
  );

  if (!existingDocument) {
    client.documents.push({ templateId, documentId });
  }

  const existingLabels = new Set(client.details.map((detail) => detail.label));

  highlights.forEach((highlight) => {
    if (!existingLabels.has(highlight.label)) {
      client.details.push({
        label: highlight.label,
        value: highlight.text,
      });
    }
  });

  await client.save();
  console.log("Existing client updated successfully");
  return client;
};

const deleteClientById = async (clientId) => {
  if (!clientId) {
    throw new Error("Client ID is required.");
  }

  const deletedClient = await Client.findByIdAndDelete(clientId);
  return deletedClient;
};

module.exports = {
  getDocumentsByClientId,
  getAllClientsWithDetails,
  createOrUpdateClientDocument,
  deleteClientById,
  updateClientEmailPhone,
};
