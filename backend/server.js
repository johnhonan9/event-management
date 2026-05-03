const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize, Admin, CompanyDetail } = require('./src/models'); 
const authRoutes = require('./src/routes/admin/auth');
const { submitEnquiry } = require('./src/controllers/enquiryController');
const { getStats } = require('./src/controllers/dashboardController');
const { generateSitemap } = require('./src/controllers/sitemapController');

const categoryRoutes = require('./src/routes/admin/categories');
const packageRoutes = require('./src/routes/admin/packages');
const enquiryRoutes = require('./src/routes/admin/enquiries');
const galleryRoutes = require('./src/routes/admin/gallery');
const bannerRoutes = require('./src/routes/admin/banners');
const testimonialRoutes = require('./src/routes/admin/testimonials');
const settingsRoutes = require('./src/routes/admin/settings');
const adminUserRoutes = require('./src/routes/admin/admins');
const companyDetailRoutes = require('./src/routes/admin/companyDetails');
const faqRoutes = require('./src/routes/admin/faqs');

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// 🔒 SECURITY & CORS
// ==========================================
app.use(helmet());

// ✅ Explicitly allow your Vercel frontend + localhost
const allowedOrigins = [
  'https://event-management-theta-snowy.vercel.app',
  'http://localhost:5173',
  'http://localhost:3001'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// ==========================================
// 📁 PUBLIC ROUTES
// ==========================================
app.get('/sitemap.xml', generateSitemap);
app.post('/api/enquiries', submitEnquiry);

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

app.get('/', (req, res) => res.send('Event Management API Running'));

// ==========================================
// 📁 ADMIN ROUTES
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
app.use('/api/admin/faqs', faqRoutes);
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
    console.log('👤 Default Superadmin created');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('❌ Database Connection Failed:', err.message);
  process.exit(1);
});