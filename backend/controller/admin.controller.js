
const User = require('../models/User.model');
const Listing = require('../models/Listing.model');
const Booking = require('../models/Booking.model');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const toggleSuspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isSuspended = !user.isSuspended;
    await user.save();
    res.status(200).json({ message: `User ${user.isSuspended ? 'suspended' : 'reactivated'}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllListingsAdmin = async (req, res) => {
  try {
    const listings = await Listing.find().populate('owner', 'Name email').sort({ createdAt: -1 });
    res.status(200).json({ listings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'active' | 'pending' | 'removed'
    const listing = await Listing.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.status(200).json({ listing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPlatformStats = async (req, res) => {
  try {
    const [userCount, listingCount, bookingCount, activeListingCount] = await Promise.all([
      User.countDocuments(),
      Listing.countDocuments(),
      Booking.countDocuments(),
      Listing.countDocuments({ status: 'active' })
    ]);
    res.status(200).json({ stats: { userCount, listingCount, bookingCount, activeListingCount } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={getAllListingsAdmin,getAllUsers,getPlatformStats,updateListingStatus,toggleSuspendUser}