const express=require('express')
const Router=express.Router()

const getUserById=require('../controller/user.controller')

Router.get('/:id',getUserById)

module.exports=Router