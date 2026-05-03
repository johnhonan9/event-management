const { Op } = require('sequelize');
const { Enquiry, EnquiryActivityLog, Package, Category, Admin } = require('../models');
// ✅ Fixed typo: sendCustomerAutoRepl -> sendCustomerAutoReply
const { sendAdminNotification, sendCustomerAutoReply, sendCustomEmail } = require('../utils/emailService');

// GET List of Enquiries
exports.getEnquiries = async (req, res) => {
  try {
    const { status, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { customer_name: { [Op.like]: `%${search}%` } },
        { customer_phone: { [Op.like]: `%${search}%` } }
      ];
    }

    const enquiries = await Enquiry.findAll({
      where,
      include: [{ model: Package, as: 'Package', attributes: ['name', 'slug'] }],
      order: [['created_at', 'DESC']]
    });
    res.json(enquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch enquiries' });
  }
};

// GET Single Enquiry + Timeline
exports.getEnquiryDetail = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByPk(req.params.id, {
      include: [
        { model: EnquiryActivityLog, as: 'activityLog', include: [{ model: Admin, as: 'admin', attributes: ['name'] }] },
        { model: Package, as: 'Package', attributes: ['name'] }
      ],
      order: [[{ model: EnquiryActivityLog, as: 'activityLog' }, 'createdAt', 'DESC']]
    });
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json(enquiry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH Update Status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const enquiry = await Enquiry.findByPk(req.params.id);
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    
    await enquiry.update({ status });
    
    await EnquiryActivityLog.create({
      enquiry_id: enquiry.id,
      admin_id: req.admin?.id || req.user?.id,
      action: 'Status Changed',
      note: `Status changed to ${status}`
    });
    
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST Add Note
exports.addNote = async (req, res) => {
  try {
    const { note } = req.body;
    if (!note) return res.status(400).json({ error: 'Note is required' });

    await EnquiryActivityLog.create({
      enquiry_id: req.params.id,
      admin_id: req.admin?.id || req.user?.id,
      action: 'Note Added',
      note
    });
    
    res.json({ message: 'Note added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST Submit Enquiry (Public)
exports.submitEnquiry = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, eventDate, message, source } = req.body;

    // ✅ EXPLICIT MAPPING: Map Frontend camelCase to Database snake_case
    const enquiryData = {
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || null,
      event_date: eventDate || null,
      message: message,
      source: source || 'contact_form',
      status: 'new'
    };

    // Create Enquiry
    const enquiry = await Enquiry.create(enquiryData);

    // 📧 Fire and Forget Emails (Don't block the API response)
    sendAdminNotification(enquiry).catch(err => console.error("❌ Admin Email Error:", err));
    sendCustomerAutoReply(enquiry).catch(err => console.error("❌ Customer Email Error:", err));

    res.status(201).json(enquiry);
  } catch (err) {
    console.error("❌ Enquiry Submission Error:", err);
    res.status(400).json({ 
      error: "Failed to submit enquiry", 
      details: err.errors ? err.errors.map(e => e.message) : err.message 
    });
  }
};

// ✅ NEW: Send Email to Customer from Admin
exports.sendEmailToCustomer = async (req, res) => {
  try {
    const { enquiryId, to, subject, body } = req.body;
    
    if (!to || !subject) {
      return res.status(400).json({ error: 'Recipient and Subject are required' });
    }

    // Convert plain text newlines to HTML breaks for the email
    const htmlBody = body.replace(/\n/g, '<br>');

    // 1. Send Email via Resend
    await sendCustomEmail({
      to,
      subject,
      html: htmlBody
    });

    // 2. Log Activity in Timeline
    if (enquiryId) {
      await EnquiryActivityLog.create({
        enquiry_id: enquiryId,
        admin_id: req.admin?.id || req.user?.id,
        action: 'Email Sent',
        note: `Email sent to ${to}: ${subject}`
      });
    }

    res.json({ message: 'Email sent successfully' });
  } catch (err) {
    console.error('Send Email Error:', err);
    res.status(500).json({ error: err.message });
  }
};