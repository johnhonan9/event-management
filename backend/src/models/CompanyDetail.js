const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path if needed

const CompanyDetail = sequelize.define('CompanyDetail', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  company_name: { type: DataTypes.STRING, defaultValue: 'Dream Events' },
  tagline: { type: DataTypes.STRING, defaultValue: 'Making Moments Magic' },
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

module.exports = CompanyDetail;