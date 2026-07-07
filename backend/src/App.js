const express=require('express')
const AuthRouter=require('../routes/auth.routes')
const ListingRouter=require('../routes/listing.routes')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors())

app.use('/api/auth',AuthRouter)
app.use('/api/listing',ListingRouter)

module.exports=app