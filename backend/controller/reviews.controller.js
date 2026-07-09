
const Review = require('../models/Review.model');
const User = require('../models/User.model');


const createReview = async (req, res) => {
  try {
    const { buyer, listingId, rating, comment } = req.body;

    if (!buyer || !rating) {
      return res.status(400).json({ message: 'targetUserId and rating are required' });
    }
    if (buyer === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot review yourself' });
    }

    const review = await Review.create({
     buyer: buyer,
      seller: req.user._id,
      listing: listingId,
      rating,
      comment
    });


    const allReviews = await Review.find({ buyer: buyer });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(buyer, {
      ratingAvg: avg.toFixed(1),
      ratingCount: allReviews.length
    });

    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ buyer : req.params.userId })
      .populate('seller', 'Name Picture')
      .sort({ createdAt: -1 });
    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {createReview,getReviewsForUser };