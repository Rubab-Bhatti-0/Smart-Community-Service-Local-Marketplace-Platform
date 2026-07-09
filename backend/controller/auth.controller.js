const user = require('../models/User.model');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    try {
        const { Name, email, password, role } = req.body;
        if (!Name || !password || !email) {
            return res.status(400).json({ message: "Enter credentials" });
        }
        const isEmailExist = await user.findOne({ email });
        if (isEmailExist) {
            return res.status(400).json({ message: "There is already an account on this email." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashpass = await bcrypt.hash(password, salt);
        const u = await user.create({
            Name,
            email,
            password: hashpass,
            role: role || 'buyer'
        });
        const token = generateToken(u._id);
        res.status(201).json({
            token,
            user: { id: u._id, name: u.Name, email: u.email, role: u.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Enter credentials" });
        }
        const u = await user.findOne({ email });
        if (!u) {
            return res.status(401).json({ message: "Invalid credentials, check email and password" });
        }
        if (u.isSuspended) {
            return res.status(403).json({ message: 'Account suspended!' });
        }
        const isValid = await bcrypt.compare(password, u.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(u._id);
        res.status(200).json({
            token,
            user: { id: u._id, name: u.Name, email: u.email, role: u.role }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getMe = async (req, res) => {
    res.status(200).json({
        user: {
            id: req.user._id,
            name: req.user.Name,
            email: req.user.email,
            role: req.user.role,
            Picture: req.user.Picture,
            Bio: req.user.Bio,
            Contact: req.user.Contact,
            Location: req.user.Location,
            Services: req.user.Services,
            RatingAvg: req.user.RatingAvg,
            RatingCount: req.user.RatingCount
        }
    });
};

module.exports = { registerUser, loginUser, getMe };
