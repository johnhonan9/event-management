const express = require('express');
const router = express.Router();
const { 
  getEnquiries, 
  getEnquiryDetail, 
  submitEnquiry, 
  updateStatus, 
  addNote,
  sendEmailToCustomer
} = require('../../controllers/enquiryController');

router.get('/', getEnquiries);
router.get('/:id', getEnquiryDetail);
router.post('/', submitEnquiry);
router.put('/:id/status', updateStatus);
router.post('/:id/notes', addNote);
router.post('/:id/email', sendEmailToCustomer); // ✅ New Route

module.exports = router;