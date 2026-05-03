const express = require('express');
const router = express.Router();
const { getDetails, updateDetails } = require('../../controllers/companyDetailController');

router.get('/', getDetails);
router.put('/', updateDetails);

module.exports = router;