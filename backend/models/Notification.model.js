const mongoose=require('mongoose')

const notificationSchema=new mongoose.Schema({
        user:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
        type: { type: String, enum: ['booking', 'message', 'review', 'listing'], required: true },
        message:{type:String,required:true},
        isRead:{type:Boolean,default:false}

},{timestamps:true})

const notificationModel=mongoose.model('notification',notificationSchema)
module.exports=notificationModel