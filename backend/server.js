const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// ✅ Import CompanyDetail model
const { sequelize, Admin, CompanyDetail } = require('./src/models'); 
const authRoutes = require('./src/routes/admin/auth');
const { submitEnquiry } = require('./src/controllers/enquiryController');
const { getStats } = require('./src/controllers/dashboardController');
const { generateSitemap } = require('./src/controllers/sitemapController');

// ✅ Import all Admin Routes
const categoryRoutes = require('./src/routes/admin/categories');
const packageRoutes = require('./src/routes/admin/packages');
const enquiryRoutes = require('./src/routes/admin/enquiries');
const galleryRoutes = require('./src/routes/admin/gallery');
const bannerRoutes = require('./src/routes/admin/banners');
const testimonialRoutes = require('./src/routes/admin/testimonials');
const settingsRoutes = require('./src/routes/admin/settings');
const adminUserRoutes = require('./src/routes/admin/admins');
const companyDetailRoutes = require('./src/routes/admin/companyDetails');

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// 🔒 HYBRID CORS CONFIG (Dev + Prod)
// ==========================================
app.use(helmet());

// List of allowed origins
const allowedOrigins = [
  'http://localhost:5173', // Always allow Local Development
  'http://localhost:3001', // Local API
  process.env.CORS_ORIGIN // Allow Production Domain (from .env)
].filter(Boolean); // Remove empty values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// ==========================================
// 📁 PUBLIC ROUTES (No Auth Required)
// ==========================================

// ✅ Public Sitemap Endpoint
app.get('/sitemap.xml', generateSitemap);

// 1. Submit Enquiry
app.post('/api/enquiries', submitEnquiry);

// 2. Public Company Details Endpoint
app.get('/api/company-details', async (req, res) => {
  try {
    let details = await CompanyDetail.findOne();
    if (!details) {
      details = await CompanyDetail.create({ company_name: 'Dream Events' });
    }
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Health Check
app.get('/', (req, res) => res.send('Event Management API Running'));

// ==========================================
//  ADMIN ROUTES (Protected)
// ==========================================
app.use('/api/admin/auth', authRoutes);
app.use('/api/admin/categories', categoryRoutes);
app.use('/api/admin/packages', packageRoutes);
app.use('/api/admin/enquiries', enquiryRoutes);
app.use('/api/admin/gallery', galleryRoutes);
app.use('/api/admin/banners', bannerRoutes);
app.use('/api/admin/testimonials', testimonialRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin/admins', adminUserRoutes);
app.use('/api/admin/dashboard/stats', getStats); 
app.use('/api/admin/faqs', require('./src/routes/admin/faqs'));
app.use('/api/admin/company-details', companyDetailRoutes);

// ==========================================
// 🚀 START SERVER
// ==========================================

sequelize.sync({ alter: true }).then(async () => {
  console.log('✅ Database connected & synced');
  
  const count = await Admin.count();
  if (count === 0) {
    const hash = require('bcryptjs').hashSync('Admin@123', 12);
    await Admin.create({ name: 'Super Admin', email: 'admin@demo.com', password_hash: hash, role: 'superadmin' });
    console.log('👤 Default Superadmin created: admin@demo.com / Admin@123');
  }

  // ✅ Bind to 0.0.0.0 for Production hosting compatibility
  app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => console.error(' DB Error:', err));