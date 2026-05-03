const { CompanyDetail } = require('../models');

exports.getDetails = async (req, res) => {
  try {
    let details = await CompanyDetail.findOne();
    if (!details) {
      details = await CompanyDetail.create({ company_name: 'New Company' });
    }
    res.json(details);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const data = req.body;
    let details = await CompanyDetail.findOne();
    
    if (details) {
      await details.update(data);
    } else {
      details = await CompanyDetail.create(data);
    }
    res.json(details);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};