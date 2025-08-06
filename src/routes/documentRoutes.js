const express = require("express");
const router = express.Router();
const documentController = require("../controllers/documentController");
const { auth } = require("../middleware/auth");

//router.get('/:id/highlights', documentController.getHighlightsByTemplateId);

// Get all documents from database
router.get("/", auth, documentController.getAllDocuments);

// to update filesName and text in the document..
router.put("/updatedoc/:id", auth, documentController.updateDocument);

// to add a new document for a template doc.
router.post("/add-document", auth, documentController.addNewDocForTemplate);

// to fetch the existing document of a template.
router.get(
  "/template-documents/:id",
  auth,
  documentController.getDocumentsByTemplateId
);

router.get("/view-document/:id", auth, documentController.getDocumentId);

// to delete the document from document collection and its reference from template .
router.delete("/delete-doc/:documentId", auth, documentController.deleteDocument);

router.post("/zip-documents", auth, documentController.zipDocuments);

router.get(
  "/documents-with-template-names",
  auth,
  documentController.getAllDocumentsWithTemplateName
);

router.post("/:id/download", auth, documentController.downloadDocumentIndoc);

//this route updates only the document content when user saves the editted document content from preview page.
router.put("/update-content/:id", auth, documentController.updateDocumentContent);

router.get('/view-document/:id', auth, documentController.getDocumentsByTemplateId);

module.exports = router;
