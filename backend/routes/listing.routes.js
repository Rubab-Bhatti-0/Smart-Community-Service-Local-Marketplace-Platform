const express = require('express');
const Router = express.Router();
const { editListing, viewListing, createListing, delListing, getListingByID } = require('../controller/listings.controller');
const { authorizaton, requireRoles } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

Router.get('/viewall', viewListing);
Router.get('/getmine', authorizaton, async (req, res) => {
    try {
        const serviceModel = require('../models/Listing.model');
        const listings = await serviceModel.find({ owner: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ listings });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
Router.get('/:id', getListingByID);
Router.post('/create', authorizaton, requireRoles('seller', 'admin'), upload.array('images', 5), createListing);
Router.put('/edit/:id', authorizaton, requireRoles('seller', 'admin'), upload.array('images', 5), editListing);
Router.delete('/del/:id', authorizaton, delListing);

module.exports = Router;
