const { Gallery, Category } = require('../models');

// GET all gallery images
exports.getGallery = async (req, res) => {
  try {
    const { category_id } = req.query;
    const where = {};
    if (category_id && category_id !== 'all') where.category_id = category_id;

    const images = await Gallery.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
      order: [['display_order', 'ASC'], ['created_at', 'DESC']]
    });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
};

// POST new image
exports.createImage = async (req, res) => {
  try {
    // FIX: Convert empty string to null for UUID field
    const { category_id, ...rest } = req.body;
    const cleanData = { 
      ...rest, 
      category_id: category_id === '' ? null : category_id 
    };

    const image = await Gallery.create(cleanData);
    res.status(201).json(image);
  } catch (err) {
    console.error("❌ Create Image Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// PUT update image
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, ...rest } = req.body;
    const cleanData = { 
      ...rest, 
      category_id: category_id === '' ? null : category_id 
    };

    const image = await Gallery.findByPk(id);
    if (!image) return res.status(404).json({ error: 'Not found' });

    await image.update(cleanData);
    res.json(image);
  } catch (err) {
    console.error("❌ Update Image Error:", err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Gallery.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};