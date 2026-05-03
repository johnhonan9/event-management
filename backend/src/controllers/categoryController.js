const { Category } = require('../models');

// GET all categories ordered
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['display_order', 'ASC']] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// CREATE new category
exports.createCategory = async (req, res) => {
  try {
    // Simple slug generation if not provided
    const slug = req.body.slug || req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const category = await Category.create({ ...req.body, slug });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    
    await category.update(req.body);
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Category not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete' });
  }
};