const { Category, Package } = require('../models');

exports.generateSitemap = async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://yourdomain.com';
    const today = new Date().toISOString().split('T')[0];

    // Fetch active content
    const categories = await Category.findAll({ where: { is_active: true }, attributes: ['slug', 'updatedAt'] });
    const packages = await Package.findAll({ where: { is_active: true }, attributes: ['slug', 'updatedAt'] });

    // Build XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    // Homepage
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/category</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    // Categories
    categories.forEach(cat => {
      const mod = cat.updatedAt ? new Date(cat.updatedAt).toISOString().split('T')[0] : today;
      xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <lastmod>${mod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    // Packages
    packages.forEach(pkg => {
      const mod = pkg.updatedAt ? new Date(pkg.updatedAt).toISOString().split('T')[0] : today;
      xml += `  <url>\n    <loc>${baseUrl}/package/${pkg.slug}</loc>\n    <lastmod>${mod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    console.error('Sitemap Error:', err);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
};