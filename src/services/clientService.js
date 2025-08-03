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

/*this method creates  if clientName not found in db
 * or updates client,  like adding new document for template
 * and adding new labels if not already existing in details.
 */
const createOrUpdateClientDocument = async (
  clientName,
  templateId,
  documentId,
  highlights
) => {
  if (!clientName || !templateId || !documentId) {
    throw new Error(
      "Missing required fields: clientName, templateId, or documentId."
    );
  }

  let client = await Client.findOne({ name: clientName });

  if (!client) {
    // Generate default empid and email for system-created clients
    const defaultEmpid = `EMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const defaultEmail = `client_${Date.now()}@system.generated`;
    
    client = new Client({
      name: clientName,
      empid: defaultEmpid,
      email: defaultEmail,
      documents: [{ templateId, documentId }],
      details: highlights.map((highlight) => ({
        label: highlight.label,
        value: highlight.text,
      })),
    });
    await client.save();
    return client;
  }

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
};
