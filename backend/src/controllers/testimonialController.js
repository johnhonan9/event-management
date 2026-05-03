const { Testimonial } = require('../models');
exports.getTestimonials = async (req, res) => {
  const { approved } = req.query;
  const where = {};
  if (approved === 'true') where.is_approved = true;
  const data = await Testimonial.findAll({ where, order: [['display_order', 'ASC'], ['created_at', 'DESC']] });
  res.json(data);
};
exports.createTestimonial = async (req, res) => {
  const t = await Testimonial.create(req.body);
  res.status(201).json(t);
};
exports.updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const t = await Testimonial.findByPk(id);
  if (!t) return res.status(404).json({ error: 'Not found' });
  await t.update(req.body);
  res.json(t);
};
exports.deleteTestimonial = async (req, res) => {
  const { id } = req.params;
  const deleted = await Testimonial.destroy({ where: { id } });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
};