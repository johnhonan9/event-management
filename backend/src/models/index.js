const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');
// const CompanyDetail = require('./CompanyDetail');

// --- Faq ---
const Faq = sequelize.define('Faq', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  question: { type: DataTypes.STRING, allowNull: false },
  answer: { type: DataTypes.TEXT, allowNull: false },
  category: { type: DataTypes.STRING, defaultValue: 'General' }, // e.g., Booking, Pricing, Events
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'faqs', timestamps: true, underscored: true });

// --- Admins ---
const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('superadmin', 'editor', 'viewer'), defaultValue: 'editor' },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'admins', timestamps: true, underscored: true });

// --- Company Settings ---
const CompanySetting = sequelize.define('CompanySetting', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  company_name: { type: DataTypes.STRING, defaultValue: 'Dream Events' },
  whatsapp_number: { type: DataTypes.STRING },
  logo_url: { type: DataTypes.STRING }
}, { tableName: 'company_settings', timestamps: true, underscored: true });

// --- Categories ---
const Category = sequelize.define('Category', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: DataTypes.TEXT,
  thumbnail_url: DataTypes.STRING,
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'categories', timestamps: true, underscored: true });

// --- Packages ---
const Package = sequelize.define('Package', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  category_id: { type: DataTypes.UUID, allowNull: false },
  images: { 
    type: DataTypes.JSON, // ✅ Ensure this is set to JSON
    allowNull: true, 
    defaultValue: [] 
  },
  name: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, unique: true, allowNull: false },
  short_description: DataTypes.TEXT,
  full_description: DataTypes.TEXT,
  price: { type: DataTypes.DECIMAL(10, 2) },
  discounted_price: { type: DataTypes.DECIMAL(10, 2) },
  duration_hours: { type: DataTypes.INTEGER, defaultValue: 4 },
  min_guests: { type: DataTypes.INTEGER, defaultValue: 10 },
  max_guests: { type: DataTypes.INTEGER, defaultValue: 50 },
  is_featured: { type: DataTypes.BOOLEAN, defaultValue: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  display_order: DataTypes.INTEGER,
  badge_text: DataTypes.STRING,
  whatsapp_message: DataTypes.TEXT,
  view_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  meta_title: DataTypes.STRING,
  meta_description: DataTypes.TEXT
}, { tableName: 'packages', timestamps: true, underscored: true });

// --- Enquiries ---
const Enquiry = sequelize.define('Enquiry', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  package_id: { type: DataTypes.UUID, allowNull: true },
  category_id: { type: DataTypes.UUID, allowNull: true },
  customer_name: { type: DataTypes.STRING, allowNull: false },
  customer_phone: { type: DataTypes.STRING, allowNull: false },
  customer_email: DataTypes.STRING,
  event_date: DataTypes.DATE,
  venue: DataTypes.STRING,
  guest_count: DataTypes.INTEGER,
  message: DataTypes.TEXT,
  source: { type: DataTypes.ENUM('whatsapp', 'contact_form', 'callback_request'), defaultValue: 'contact_form' },
  status: { type: DataTypes.ENUM('new', 'contacted', 'quoted', 'confirmed', 'cancelled', 'closed'), defaultValue: 'new' },
  assigned_to: { type: DataTypes.UUID, allowNull: true },
  follow_up_date: DataTypes.DATE,
  notes: DataTypes.TEXT
}, { tableName: 'enquiries', timestamps: true, underscored: true });

const EnquiryActivityLog = sequelize.define('EnquiryActivityLog', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  enquiry_id: { type: DataTypes.UUID, allowNull: false },
  admin_id: { type: DataTypes.UUID, allowNull: true },
  action: DataTypes.STRING,
  note: DataTypes.TEXT,
}, { tableName: 'enquiry_activity_logs', timestamps: true, underscored: true });

// Relationships
Category.hasMany(Package, { foreignKey: 'category_id', as: 'packages' });
Package.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

Enquiry.belongsTo(Package, { foreignKey: 'package_id', as: 'Package' });
Enquiry.belongsTo(Category, { foreignKey: 'category_id', as: 'Category' });
Enquiry.belongsTo(Admin, { as: 'assignedAdmin', foreignKey: 'assigned_to' });
Enquiry.hasMany(EnquiryActivityLog, { foreignKey: 'enquiry_id', as: 'activityLog' });
EnquiryActivityLog.belongsTo(Admin, { as: 'admin', foreignKey: 'admin_id' });

// --- Gallery ---
const Gallery = sequelize.define('Gallery', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  category_id: { type: DataTypes.UUID, allowNull: true },
  image_url: { type: DataTypes.STRING, allowNull: false },
  caption: { type: DataTypes.STRING },
  event_date: { type: DataTypes.DATE },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'gallery', timestamps: true, underscored: true });

// Relationships
Gallery.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Category.hasMany(Gallery, { foreignKey: 'category_id' });

// --- Banners ---
const Banner = sequelize.define('Banner', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  image_url: DataTypes.STRING,
  mobile_image_url: DataTypes.STRING,
  cta_text: DataTypes.STRING,
  cta_link: DataTypes.STRING,
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { tableName: 'banners', timestamps: true, underscored: true });

// --- Testimonials ---
const Testimonial = sequelize.define('Testimonial', {
  id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
  customer_name: { type: DataTypes.STRING, allowNull: false },
  review_text: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 5 },
  event_type: DataTypes.STRING,
  photo_url: DataTypes.STRING,
  is_approved: { type: DataTypes.BOOLEAN, defaultValue: false },
  display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'testimonials', timestamps: true, underscored: true });

// --- New Company Details ---
// const CompanyDetail = sequelize.define('CompanyDetail', {
//   id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
//   company_name: { type: DataTypes.STRING, defaultValue: 'Dream Events' },
//   tagline: { type: DataTypes.STRING, defaultValue: 'Making Moments Magic' },
//   whatsapp_number: { type: DataTypes.STRING },
//   phone_number: { type: DataTypes.STRING },
//   email: { type: DataTypes.STRING },
//   address: { type: DataTypes.TEXT },
//   instagram_url: { type: DataTypes.STRING },
//   facebook_url: { type: DataTypes.STRING },
//   youtube_url: { type: DataTypes.STRING },
//   google_maps_link: { type: DataTypes.TEXT },
//   primary_color: { type: DataTypes.STRING, defaultValue: '#1E3A5F' },
//   secondary_color: { type: DataTypes.STRING, defaultValue: '#E91E8C' }
// }, {
//   tableName: 'company_details',
//   timestamps: true,
//   underscored: true
// });

const CompanyDetail = sequelize.define('CompanyDetail', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  company_name: { type: DataTypes.STRING }, // ✅ Removed allowNull: false to make it optional
  tagline: { type: DataTypes.STRING, defaultValue: 'Making Moments Magic' },
  logo_url: { type: DataTypes.STRING },     // ✅ Added Logo URL
  whatsapp_number: { type: DataTypes.STRING },
  phone_number: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  instagram_url: { type: DataTypes.STRING },
  facebook_url: { type: DataTypes.STRING },
  youtube_url: { type: DataTypes.STRING },
  google_maps_link: { type: DataTypes.TEXT },
  primary_color: { type: DataTypes.STRING, defaultValue: '#1E3A5F' },
  secondary_color: { type: DataTypes.STRING, defaultValue: '#E91E8C' }
}, {
  tableName: 'company_details',
  timestamps: true,
  underscored: true
});

module.exports = { sequelize, Admin, CompanySetting, Category, Package, Enquiry, EnquiryActivityLog, Gallery, Banner, Testimonial, CompanyDetail, Faq };