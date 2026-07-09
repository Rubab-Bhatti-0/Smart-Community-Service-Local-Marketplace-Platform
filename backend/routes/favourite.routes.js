const express=require('express')
const Router=express.Router()

const {toggleFavorite,getMyFavorites}=require('../controller/favourite.controller')
const {authorizaton,requireRoles}=require('../middleware/auth.middleware')

Router.patch('/:id',authorizaton,toggleFavorite);
Router.get('/mine',authorizaton,getMyFavorites)

module.exports=Router