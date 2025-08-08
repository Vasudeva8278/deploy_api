const express = require("express");
const router = express.Router();
const documentProjectController = require("../controllers/documentProjectController");
const templateProjectController = require("../controllers/templateProjectController");
const { sendEmail } = require("../utils/helper");
const { auth } = require("../middleware/auth");

//router.get('/:id/highlights', documentProjectController.getHighlightsByTemplateId);

// to update filesName and text in the document..
router.put("/updatedoc/:id", auth, documentProjectController.updateDocument);

// to add a new document for a template doc.
router.post("/add-document", auth, documentProjectController.addNewDocForTemplate);

//to add or update a highlight in a templateDoc
router.put('/add-highlights/:id', auth, templateProjectController.addNewHighlight);

//to delete a highlight from a template
router.delete('/delete-highlight/:templateId', auth, templateProjectController.deleteHighlight);

router.get(
  "/commonData/:id/:docName",
  auth,
  documentProjectController.getCommonDocumentData
);

// to fetch the existing document of a template.
router.get(
  "/:pid/template-documents/:id",
  auth,
  documentProjectController.getDocumentsByTemplateId
);

router.get("/view-document/:id", auth, documentProjectController.getDocumentId);

//to send the selected document to registered Email.
router.get(
  "/email-document/:id",
  auth,
  documentProjectController.sendDocumentViaEmail
);

// to delete the document from document collection and its reference from template .
router.delete(
  "/:pid/documents/delete-doc/:documentId",
  auth,
  documentProjectController.deleteDocument
);

router.post("/zip-documents", auth, documentProjectController.zipDocuments);

router.get(
  "/:pid/documents/documents-with-template-names",
  auth,
  documentProjectController.getAllDocumentsWithTemplateName
);

// Route with auth but no userId filtering
router.get(
  "/:pid/documents/documents-with-template-names-by-user",
  auth,
  documentProjectController.getAllDocumentsWithTemplateNameByUser
);

router.post("/:id/download", auth, documentProjectController.downloadDocumentIndoc);

//this route updates only the document content when user saves the editted document content from preview page.
router.put(
  "/update-content/:id",
  auth,
  documentProjectController.updateDocumentContent
);

router.post(
  "/create-multiDocs",
  auth,
  documentProjectController.createDocsForMultipleTemplates
);


router.post(
  "/generate-documents",
  auth,
  documentProjectController.ZipDocumentsgenerate
);

module.exports = router;
