
const express = require('express');
const router = express.Router();
const { authorizaton, requireRoles } = require('../middleware/auth.middleware');
const {
  getAllUsers, toggleSuspendUser, getAllListingsAdmin, updateListingStatus, getPlatformStats
} = require('../controller/admin.controller');

router.use(authorizaton, requireRoles('admin')); 

router.get('/users', getAllUsers);
router.patch('/users/:id/suspend', toggleSuspendUser);
router.get('/listings', getAllListingsAdmin);
router.patch('/listings/:id/status', updateListingStatus);
router.get('/stats', getPlatformStats);

module.exports = router;