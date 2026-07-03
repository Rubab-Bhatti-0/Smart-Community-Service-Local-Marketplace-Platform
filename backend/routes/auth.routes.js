const express=require('express')
const Router=express.Router()

const {registerUser,loginUser,getMe} =require('../controller/auth.controller')
const {authorizaton}=require('../middleware/auth.middleware')

Router.post('/register',registerUser)
Router.post('/login',loginUser)
Router.get('/me',authorizaton,getMe)

module.exports=Router