const { Banner } = require('../models');
exports.getBanners = async (req, res) => {
  const banners = await Banner.findAll({ order: [['display_order', 'ASC']] });
  res.json(banners);
};
exports.createBanner = async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
};
exports.updateBanner = async (req, res) => {
  const { id } = req.params;
  const banner = await Banner.findByPk(id);
  if (!banner) return res.status(404).json({ error: 'Not found' });
  await banner.update(req.body);
  res.json(banner);
};
exports.deleteBanner = async (req, res) => {
  const { id } = req.params;
  const deleted = await Banner.destroy({ where: { id } });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true });
};