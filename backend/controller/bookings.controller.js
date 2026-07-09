const Booking = require('../models/Booking.model');
const Listing = require('../models/Listing.model');
const Notification = require('../models/Notification.model');

const createBooking = async (req, res) => {
  try {
    const { listingId, date: Date, time: Time, notes } = req.body;

    if (!listingId || !Date) {
      return res.status(400).json({ message: 'listingId and date are required' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }


    if (listing.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own listing' });
    }

    const booking = await Booking.create({
      buyer: req.user._id,
      listing: listingId,
      Date,
      Time,
      notes,
      status: 'pending'
    });


    await Notification.create({
      user: listing.owner,
      type: 'booking',
      message: `New booking request for "${listing.title}"`
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ buyer: req.user._id })
      .populate('listing', 'title Pricing Images owner').populate('listing.owner', 'Name Picture')
      .sort({ createdAt: -1 });
    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getReceivedBookings = async (req, res) => {
  try {
    
    const myListings = await Listing.find({ owner: req.user._id }).select('_id');
    const myListingIds = myListings.map(l => l._id);

    const bookings = await Booking.find({ listing: { $in: myListingIds } })
      .populate('listing', 'title Pricing Images')
      .populate('buyer', 'Name Picture')
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; 
    const booking = await Booking.findById(req.params.id).populate('listing');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isBuyer = booking.buyer.toString() === req.user._id.toString();
    const isSeller = booking.listing.owner.toString() === req.user._id.toString();

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized on this booking' });
    }

    
    if (status === 'cancelled' && !isBuyer) {
      return res.status(403).json({ message: 'Only the buyer can cancel' });
    }
    if (['accepted', 'rejected', 'completed'].includes(status) && !isSeller) {
      return res.status(403).json({ message: 'Only the listing owner can do that' });
    }

    booking.status = status;
    await booking.save();

  
    const notifyUserId = isBuyer ? booking.listing.owner : booking.buyer;
    await Notification.create({
      user: notifyUserId,
      type: 'booking',
      message: `Booking status updated to "${status}" for "${booking.listing.title}"`
    });

    res.status(200).json({ booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports={createBooking,updateBookingStatus,getMyBookings,getReceivedBookings}