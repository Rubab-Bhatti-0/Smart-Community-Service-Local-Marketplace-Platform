const Review = require('../models/Review.model');
const User = require('../models/User.model');

const createReview = async (req, res) => {
    try {
        const { targetUserId, listingId, rating, comment } = req.body;
        if (!targetUserId || !rating) {
            return res.status(400).json({ message: 'targetUserId and rating are required' });
        }
        if (targetUserId === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot review yourself' });
        }
        const existing = await Review.findOne({ buyer: req.user._id, seller: targetUserId });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this seller' });
        }
        const review = await Review.create({
            buyer: req.user._id,
            seller: targetUserId,
            listing: listingId,
            rating,
            comment
        });
        const allReviews = await Review.find({ seller: targetUserId });
        const avg = allReviews.length > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
            : 0;
        await User.findByIdAndUpdate(targetUserId, {
            RatingAvg: avg.toFixed(1),
            RatingCount: allReviews.length
        });
        res.status(201).json({ review });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getReviewsForUser = async (req, res) => {
    try {
        const reviews = await Review.find({ seller: req.params.userId })
            .populate('buyer', 'Name Picture')
            .sort({ createdAt: -1 });
        res.status(200).json({ reviews });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { createReview, getReviewsForUser };
