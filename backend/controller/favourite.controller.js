
const Favorite = require('../models/favourite.model');
const Listing=require('../models/Listing.model')

const toggleFavorite = async (req, res) => {
    try {
    const listingId = req.params.id;

    const listingExists = await Listing.exists({ _id: listingId });
    if (!listingExists) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const existing = await Favorite.findOne({ user: req.user._id, listing: listingId });

    if (existing) {
      await existing.deleteOne();
      return res.status(200).json({ favorited: false });
    }

    await Favorite.create({ user: req.user._id, listing: listingId });
    res.status(201).json({ favorited: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate('listing', 'title Pricing Images serviceCategory type');
    res.status(200).json({ favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={toggleFavorite,getMyFavorites}