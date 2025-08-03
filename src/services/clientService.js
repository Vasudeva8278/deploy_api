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
    .select("_id name empid email documents")
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

// Update existing clients with proper empid and email
const updateClientEmpidEmail = async (clientId, empid, email) => {
  if (!clientId || !empid || !email) {
    throw new Error("Client ID, empid, and email are required.");
  }

  // Check if empid already exists for another client
  const existingEmpid = await Client.findOne({ empid, _id: { $ne: clientId } });
  if (existingEmpid) {
    throw new Error("Client with this empid already exists.");
  }

  // Check if email already exists for another client
  const existingEmail = await Client.findOne({ email, _id: { $ne: clientId } });
  if (existingEmail) {
    throw new Error("Client with this email already exists.");
  }

  const updatedClient = await Client.findByIdAndUpdate(
    clientId,
    { empid, email },
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
  empid = null,
  email = null
) => {
  console.log("=== createOrUpdateClientDocument CALLED ===");
  console.log("clientName:", clientName);
  console.log("templateId:", templateId);
  console.log("documentId:", documentId);
  console.log("highlights count:", highlights ? highlights.length : 0);
  console.log("empid parameter:", empid);
  console.log("email parameter:", email);
  console.log("empid type:", typeof empid);
  console.log("email type:", typeof email);
  console.log("empid is null/undefined:", empid == null);
  console.log("email is null/undefined:", email == null);
  
  if (!clientName || !templateId || !documentId) {
    throw new Error(
      "Missing required fields: clientName, templateId, or documentId."
    );
  }

  let client = await Client.findOne({ name: clientName });
  console.log("Existing client found:", client ? "Yes" : "No");

  if (!client) {
    // Use provided empid and email, or generate defaults if not provided
    const finalEmpid = empid || `EMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const finalEmail = email || `client_${Date.now()}@system.generated`;
    
    console.log("=== CREATING NEW CLIENT ===");
    console.log("finalEmpid:", finalEmpid);
    console.log("finalEmail:", finalEmail);
    console.log("empid was provided:", !!empid);
    console.log("email was provided:", !!email);
    console.log("=== END NEW CLIENT DATA ===");
    
    client = new Client({
      name: clientName,
      empid: finalEmpid,
      email: finalEmail,
      documents: [{ templateId, documentId }],
      details: highlights.map((highlight) => ({
        label: highlight.label,
        value: highlight.text,
      })),
    });
    await client.save();
    console.log("New client created successfully with empid:", client.empid, "and email:", client.email);
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
  updateClientEmpidEmail,
};
