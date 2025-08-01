const express = require('express');
const router = express.Router();
const templateProjectController = require('../controllers/templateProjectController');

// get all templates on loading page
router.get('/:pid/templates/', templateProjectController.getAllTemplates);
router.get('/:pid/templates/homePageTemplates/', templateProjectController.getAllTemplatesForHomePage);
router.get('/:pid/templates/templatesList/', templateProjectController.getAllTemplatesByProjectId);


//get template by on DocxToTextConverter
router.get('/:pid/templates/:id', templateProjectController.getTemplateById);

//delete template 
router.delete('/:pid/templates/:id', templateProjectController.deleteTemplateById);

//to add or update a highlight in a templateDoc
router.put('/add-highlights/:id', templateProjectController.addNewHighlight);

//to delete a highlight from a template
router.delete('/delete-highlight/:templateId',templateProjectController.deleteHighlight);

router.put('/:id', templateProjectController.updateTemplateById);


router.post('/:pid/templates/converted', templateProjectController.convertedFile);

router.get('/:id/download', templateProjectController.downloadTemplateById);

router.post('/:id/export', templateProjectController.exportTemplate);




module.exports = router;
