const express = require('express');
const router = express.Router();
const { getGallery, createImage, updateImage, deleteImage } = require('../../controllers/galleryController');

router.get('/', getGallery);
router.post('/', createImage);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);

module.exports = router;