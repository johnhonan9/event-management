const { Faq } = require('../models');

exports.getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['createdAt', 'DESC']]
    });
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateFaq = async (req, res) => {
  try {
    const [updated] = await Faq.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      const updatedFaq = await Faq.findByPk(req.params.id);
      return res.json(updatedFaq);
    }
    res.status(404).json({ error: 'FAQ not found' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteFaq = async (req, res) => {
  try {
    await Faq.destroy({ where: { id: req.params.id } });
    res.json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};