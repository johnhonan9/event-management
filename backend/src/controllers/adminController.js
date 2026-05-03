const { Admin } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({ 
      attributes: { exclude: ['password_hash'] }, // Don't send hashes
      order: [['created_at', 'DESC']] 
    });
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admins' });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { email, password, name, role, is_active } = req.body;
    
    // Check if email exists
    const existing = await Admin.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    // Hash password
    const hash = bcrypt.hashSync(password, 12);
    const admin = await Admin.create({ email, password_hash: hash, name, role, is_active });
    
    // Return without hash
    const safeAdmin = admin.toJSON();
    delete safeAdmin.password_hash;
    
    res.status(201).json(safeAdmin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, is_active, new_password } = req.body;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).json({ error: 'Not found' });

    const updateData = { name, role, is_active };
    if (new_password && new_password.length > 0) {
      updateData.password_hash = bcrypt.hashSync(new_password, 12);
    }

    await admin.update(updateData);
    
    const safeAdmin = admin.toJSON();
    delete safeAdmin.password_hash;
    res.json(safeAdmin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    // Prevent deleting self (handled in frontend usually, but good for safety)
    const deleted = await Admin.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
};