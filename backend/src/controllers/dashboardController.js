const { Enquiry, Package, Gallery, Category } = require('../models');
const { Op } = require('sequelize');

exports.getStats = async (req, res) => {
  try {
    // 1. Count Total Enquiries
    const totalEnquiries = await Enquiry.count();
    
    // 2. Count New Enquiries (Status = 'new')
    const newEnquiries = await Enquiry.count({ where: { status: 'new' } });

    // 3. Count Active Packages
    const activePackages = await Package.count({ where: { is_active: true } });

    // 4. Count Gallery Images
    const totalImages = await Gallery.count({ where: { is_active: true } });

    // 5. Get Recent Enquiries (Last 5)
    const recentEnquiries = await Enquiry.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'customer_name', 'customer_phone', 'status', 'createdAt']
    });

    res.json({
      totalEnquiries,
      newEnquiries,
      activePackages,
      totalImages,
      recentEnquiries
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};