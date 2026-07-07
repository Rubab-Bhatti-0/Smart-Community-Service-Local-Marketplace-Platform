const express=require('express')
const Router=express.Router()
const {editListing,viewListing,createListing,delListing,getListingByID} = require('../controller/listings.controller')
const {requireRoles}=require('../middleware/auth.middleware')
const upload =require('../middleware/upload.middleware')

Router.get('/viewall',viewListing)
Router.put('/edit/:id',requireRoles,upload.array('images',5),editListing)
Router.delete('/del:/id',requireRoles,delListing)
Router.post('/create',requireRoles,upload.array('images',5),createListing)
Router.get('/view/:id',getListingByID)

module.exports=Router