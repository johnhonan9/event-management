const { Resend } = require('resend');

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// 📧 Send Notification to Admin
exports.sendAdminNotification = async (enquiry) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`📧 [MOCK EMAIL] To Admin: New Enquiry from ${enquiry.customer_name}`);
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: process.env.ADMIN_EMAIL || 'your-email@example.com',
      subject: `🆕 New Enquiry: ${enquiry.customer_name}`,
      html: `
        <h2>New Enquiry Received</h2>
        <p><strong>Name:</strong> ${enquiry.customer_name}</p>
        <p><strong>Phone:</strong> ${enquiry.customer_phone}</p>
        <p><strong>Email:</strong> ${enquiry.customer_email || 'N/A'}</p>
        <p><strong>Service:</strong> ${enquiry.service_type || 'General'}</p>
        <p><strong>Message:</strong> ${enquiry.message}</p>
        <br>
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/enquiries" style="background:#2563EB; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">View in Admin Panel</a>
      `
    });

    if (error) console.error('❌ Resend Admin Email Error:', error);
    else console.log('✅ Admin email sent:', data);
  } catch (err) {
    console.error('❌ Resend General Error:', err);
  }
};

// 📧 Send Auto-Reply to Customer
exports.sendCustomerAutoReply = async (enquiry) => {
  if (!process.env.RESEND_API_KEY || !enquiry.customer_email) return;

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: enquiry.customer_email,
      subject: `Thanks for contacting us, ${enquiry.customer_name}!`,
      html: `
        <h2>Thank you for your enquiry!</h2>
        <p>Hi ${enquiry.customer_name},</p>
        <p>We have received your request. Our events team will review the details and get back to you within 24 hours.</p>
        <p><strong>Your Reference ID:</strong> ${enquiry.id}</p>
        <br>
        <p>Warm regards,<br>Event Management Team</p>
      `
    });

    if (error) console.error('❌ Resend Customer Email Error:', error);
    else console.log('✅ Customer auto-reply sent:', data);
  } catch (err) {
    console.error('❌ Resend General Error:', err);
  }
};

// 📧 Send Custom Email from Admin
exports.sendCustomEmail = async ({ to, subject, html }) => {
  if (!process.env.RESEND_API_KEY) {
    console.log(`📧 [MOCK EMAIL] To ${to}: ${subject}`);
    return { id: 'mock_id' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev', 
      to: to,
      subject: subject,
      html: html
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Resend Custom Email Error:', error);
    throw error;
  }
};