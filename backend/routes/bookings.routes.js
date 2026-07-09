const express=require('express')
const Router =express.Router()
const {createBooking,getMyBookings,getReceivedBookings,updateBookingStatus} =require('../controller/bookings.controller')
const {authorizaton}=require('../middleware/auth.middleware')

Router.post('/create',authorizaton,createBooking)
Router.get('/getmine',authorizaton,getMyBookings)
Router.get('/received',authorizaton,getReceivedBookings)
Router.put('/:id/status',authorizaton,updateBookingStatus)

module.exports=Router