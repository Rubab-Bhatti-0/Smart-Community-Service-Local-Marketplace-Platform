const express=require('express')
const Router =express.Router()
const {createReview,getReviewsForUser} =require('../controller/reviews.controller')
const {authorizaton}=require('../middleware/auth.middleware')

Router.post('/',authorizaton,createReview)
Router.get('/user/:userId',getReviewsForUser)

module.exports=Router