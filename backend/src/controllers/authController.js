const { Admin } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (!admin.is_active) return res.status(403).json({ error: 'Account deactivated' });

    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Update last login
    admin.last_login = new Date();
    await admin.save();

    res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};