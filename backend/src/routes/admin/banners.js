const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/bannerController');
router.get('/', ctrl.getBanners);
router.post('/', ctrl.createBanner);
router.put('/:id', ctrl.updateBanner);
router.delete('/:id', ctrl.deleteBanner);
module.exports = router;