const express = require('express');
const router = express.Router();
const { getAdmins, createAdmin, updateAdmin, deleteAdmin } = require('../../controllers/adminController');

router.get('/', getAdmins);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;