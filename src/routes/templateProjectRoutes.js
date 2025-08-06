const express = require('express');
const multer = require('multer');
const router = express.Router();
const templateProjectController = require('../controllers/templateProjectController');
const { auth } = require('../middleware/auth');

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fieldSize: 25 * 1024 * 1024 }
});

// Specific routes must come before parameterized routes
router.get('/:pid/templates/homePageTemplates/', auth, templateProjectController.getAllTemplatesForHomePage);
router.get('/:pid/templates/templatesList/', auth, templateProjectController.getAllTemplatesByProjectId);

// get all templates on loading page
router.get('/:pid/templates/', auth, templateProjectController.getAllTemplates);

//get template by on DocxToTextConverter
router.get('/:pid/templates/:id', auth, templateProjectController.getTemplateById);

//delete template 
router.delete('/:pid/templates/:id', auth, templateProjectController.deleteTemplateById);

//to add or update a highlight in a templateDoc
router.put('/add-highlights/:id', auth, templateProjectController.addNewHighlight);

//to delete a highlight from a template
router.delete('/delete-highlight/:templateId', auth, templateProjectController.deleteHighlight);

router.put('/:id', auth, templateProjectController.updateTemplateById);

// File upload route - needs multer
router.post('/:pid/templates/converted', auth, upload.single("docxFile"), templateProjectController.convertedFile);

router.get('/:id/download', auth, templateProjectController.downloadTemplateById);

router.post('/:id/export', auth, templateProjectController.exportTemplate);

module.exports = router;
