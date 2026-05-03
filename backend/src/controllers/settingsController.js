const { CompanySetting } = require('../models');

exports.getSettings = async (req, res) => {
  try {
    let settings = await CompanySetting.findOne();
    if (!settings) {
        settings = await CompanySetting.create({ company_name: 'Dream Events Co.' });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const data = req.body;
    
    // ✅ EXPLICIT MAPPING: Ensure frontend camelCase maps to DB snake_case
    const mappedData = {
      company_name: data.companyName || data.company_name,
      tagline: data.tagline,
      whatsapp_number: data.whatsappNumber || data.whatsapp_number,
      phone_number: data.phoneNumber || data.phone_number, // Check if your input name is phoneNumber or phone_number
      email: data.email,
      address: data.address,
      instagram_url: data.instagramUrl || data.instagram_url,
      facebook_url: data.facebookUrl || data.facebook_url,
      youtube_url: data.youtubeUrl || data.youtube_url,
      google_maps_link: data.googleMapsLink || data.google_maps_link, // Check input name
      primary_color: data.primaryColor || data.primary_color,
      secondary_color: data.secondaryColor || data.secondary_color,
    };

    let settings = await CompanySetting.findOne();
    if (settings) {
      await settings.update(mappedData);
    } else {
      settings = await CompanySetting.create(mappedData);
    }
    res.json(settings);
  } catch (err) {
    console.error("Settings Update Error:", err);
    res.status(400).json({ error: err.message });
  }
};