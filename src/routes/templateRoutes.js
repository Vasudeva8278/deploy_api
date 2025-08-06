const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");
const { auth } = require("../middleware/auth");

// get all templates on loading page
router.get("/", auth, templateController.getAllTemplates);

router.get(
  "/homePageTemplates/",
  auth,
  templateController.getAllTemplatesForHomePage
);

//get template by on DocxToTextConverter
router.get("/:id", auth, templateController.getTemplateById);

//delete template
router.delete("/:id", auth, templateController.deleteTemplateById);

//to add or update a highlight in a templateDoc
router.put("/add-highlights/:id", auth, templateController.addNewHighlight);

// to update the template content alone. THis route is used to update content in Labeling page.
router.put("/update-content/:id", auth, templateController.updateTemplateContent);

//to delete a highlight from a template
router.delete(
  "/delete-highlight/:templateId",
  auth,
  templateController.deleteHighlight
);

router.put("/:id", auth, templateController.updateTemplateById);
router.post("/convert", auth, templateController.convertFile);

router.post("/converted", auth, templateController.convertedFile);

router.get("/:id/download", auth, templateController.downloadTemplateById);

router.post("/:id/export", auth, templateController.exportTemplate);

module.exports = router;
