const express=require('express')
const Router =express.Router()
const {markAllAsRead,markAsRead,getMyNotifications} =require('../controller/notification.controller')
const {authorizaton}=require('../middleware/auth.middleware')

Router.get('/', authorizaton, getMyNotifications);
Router.patch('/:id/read', authorizaton, markAsRead);
Router.patch('/read-all', authorizaton, markAllAsRead);

module.exports=Router