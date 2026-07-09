const express=require('express')
const Router=express.Router()
const { authorizaton } = require('../middleware/auth.middleware');
const User = require('../models/User.model');

const getUserById=require('../controller/user.controller')

Router.get('/:id',getUserById)

Router.put('/me', authorizaton, async (req, res) => {
    try {
        const updatableFields = ['name', 'bio', 'contact', 'location', 'services', 'picture'];
        const updateData = {};
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) updateData[field] = req.body[field];
        });
        
        const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true }).select('-password');
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports=Router
