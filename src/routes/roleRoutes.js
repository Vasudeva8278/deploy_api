const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth } = require('../middleware/auth');

router.post('/', auth, roleController.createRole); //working
router.get('/', auth, roleController.getAllRoles);//working
router.get('/:id', auth, roleController.getRoleById);//working
router.put('/:id', auth, roleController.updateRole);//working
router.delete('/:id', auth, roleController.deleteRole);//working

module.exports = router;
