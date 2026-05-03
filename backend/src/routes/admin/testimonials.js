const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/testimonialController');
router.get('/', ctrl.getTestimonials);
router.post('/', ctrl.createTestimonial);
router.put('/:id', ctrl.updateTestimonial);
router.delete('/:id', ctrl.deleteTestimonial);
module.exports = router;