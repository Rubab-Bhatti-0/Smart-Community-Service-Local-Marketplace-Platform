const express=require('express')
const AuthRouter=require('../routes/auth.routes')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors())

app.use('/api/auth',AuthRouter)

module.exports=app