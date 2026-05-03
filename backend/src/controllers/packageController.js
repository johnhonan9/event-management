const { Package, Category, PackageImage } = require('../models');

exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
      ],
      order: [['display_order', 'ASC']]
    });
    
    // Debug: Check the raw data before sending
    console.log("API Response Sample:", packages[0]?.dataValues); 

    res.json(packages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET all packages
exports.getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      order: [['created_at', 'DESC']] // Fixed: matches underscored: true mapping
    });
    res.json(packages);
  } catch (err) {
    console.error("❌ GET Packages Error:", err.message);
    res.status(500).json({ error: 'Failed to fetch packages' });
  }
};

// POST new package
exports.createPackage = async (req, res) => {
  try {
    const { name, category_id, price, discounted_price, short_description, duration_hours, min_guests, max_guests, badge_text, whatsapp_message, is_active } = req.body;
    
    if (!category_id || category_id === '') return res.status(400).json({ error: 'Category is required' });

    const slug = req.body.slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const pkg = await Package.create({
      name, category_id, slug, short_description,
      price: price ? parseFloat(price) : null,
      discounted_price: discounted_price ? parseFloat(discounted_price) : null,
      duration_hours: parseInt(duration_hours) || 4,
      min_guests: parseInt(min_guests) || 10,
      max_guests: parseInt(max_guests) || 50,
      badge_text, 
      whatsapp_message,
      is_active: is_active === true || is_active === 'true'
    });
    res.status(201).json(pkg);
  } catch (err) {
    console.error("❌ Create Package Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// PUT update package
exports.updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findByPk(id);
    if (!pkg) return res.status(404).json({ error: 'Package not found' });

    const slug = req.body.name ? req.body.slug || req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : req.body.slug;

    await pkg.update({
      ...req.body,
      slug,
      price: req.body.price ? parseFloat(req.body.price) : pkg.price,
      discounted_price: req.body.discounted_price ? parseFloat(req.body.discounted_price) : pkg.discounted_price,
      duration_hours: parseInt(req.body.duration_hours),
      min_guests: parseInt(req.body.min_guests),
      max_guests: parseInt(req.body.max_guests)
    });
    res.json(pkg);
  } catch (err) {
    console.error("❌ Update Package Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// DELETE package
exports.deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Package.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Package not found' });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Delete Package Error:", err.message);
    res.status(500).json({ error: 'Failed to delete package' });
  }
};