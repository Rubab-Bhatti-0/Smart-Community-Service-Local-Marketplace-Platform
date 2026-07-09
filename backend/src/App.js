const express=require('express')
const AuthRouter=require('../routes/auth.routes')
const ListingRouter=require('../routes/listing.routes')
const adminRouter=require('../routes/admin.routes')
const bookingRouter=require('../routes/bookings.routes')
const notificationRouter=require('../routes/notifications.routes')
const reviewRouter=require('../routes/review.routes')
const favouriteRouter=require('../routes/favourite.routes')
const userRoutes=require('../routes/user.routes')
const conversationRoutes=require('../routes/conversation.routes')
const cors=require('cors')
const app=express()
app.use(express.json())
app.use(cors())

app.use('/api/auth',AuthRouter)
app.use('/api/users',userRoutes)
app.use('/api/listing',ListingRouter)
app.use('/api/bookings', bookingRouter);
app.use('/api/reviews',reviewRouter);
app.use('/api/notifications', notificationRouter);
app.use('/api/favorites',favouriteRouter);
app.use('/api/admin', adminRouter);
app.use('/api/conversations', conversationRoutes);

module.exports=app