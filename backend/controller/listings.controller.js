const serviceModel = require('../models/Listing.model');

const createListing = async (req, res) => {
    try {
        const { type, title, description, pricing, deliveryTime, availability, serviceCategory, stock, location } = req.body;
        if (!title || !description || !pricing || !serviceCategory) {
            return res.status(400).json({ message: "Provide all fields that are required!" });
        }
        const imageURLs = req.files ? req.files.map(file => file.path) : [];
        const listing = await serviceModel.create({
            owner: req.user._id,
            type,
            title,
            description,
            pricing,
            deliveryTime: type === 'service' ? deliveryTime : undefined,
            availability: type === 'service' ? availability : undefined,
            images: imageURLs,
            serviceCategory,
            stock: type === 'product' ? stock : undefined,
            location
        });
        return res.status(201).json({
            message: "New listing created!",
            listing
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getListingByID = async (req, res) => {
    try {
        const listing = await serviceModel.findById(req.params.id).populate('owner', 'name picture bio ratingAvg location');
        if (!listing) {
            return res.status(404).json({ message: "No listing found!" });
        }
        return res.status(200).json({ listing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const editListing = async (req, res) => {
    try {
        const listing = await serviceModel.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found!" });
        }
        if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized! You cannot edit this listing" });
        }
        const updatableFields = ['title', 'description', 'pricing', 'stock', 'availability', 'deliveryTime', 'location', 'serviceCategory', 'type'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) listing[field] = req.body[field];
        });
        if (req.files && req.files.length > 0) {
            listing.images = req.files.map(file => file.path);
        }
        await listing.save();
        return res.status(200).json({ message: "Listing updated!", listing });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const delListing = async (req, res) => {
    try {
        const listing = await serviceModel.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ message: "No such listing found!" });
        }
        if (listing.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: "You do not have this authorization!" });
        }
        await listing.deleteOne();
        return res.status(200).json({ message: "Listing deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const viewListing = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            type,
            serviceCategory,
            minPrice,
            maxPrice,
            search,
            location,
            sort = 'Newest'
        } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (serviceCategory) filter.serviceCategory = serviceCategory;
        if (location) filter.location = { $regex: location, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.pricing = {};
            if (minPrice) filter.pricing.$gte = Number(minPrice);
            if (maxPrice) filter.pricing.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        const sortOption = sort === 'Newest' ? { createdAt: -1 } :
            sort === 'priceLow' ? { pricing: 1 } :
                sort === 'priceHigh' ? { pricing: -1 } : { createdAt: -1 };
        const skip = (Number(page) - 1) * limit;
        const [listings, total] = await Promise.all([
            serviceModel.find(filter).populate('owner', 'name picture ratingAvg location')
                .sort(sortOption).skip(skip).limit(limit),
            serviceModel.countDocuments(filter)
        ]);
        res.status(200).json({
            listings: listings,
            total: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createListing, editListing, delListing, viewListing, getListingByID };
