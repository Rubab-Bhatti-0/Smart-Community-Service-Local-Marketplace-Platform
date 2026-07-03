const mongoose=require('mongoose')

const bookingSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    Date:{type:Date,required:true},
    Time:{type:String,required:true},
    listing:{type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true},
    notes:{type:String},

    status: { type: String, enum: ['pending', 'accepted', 'rejected','completed'], default: 'pending' }


},{timestamps:true})

const bookingModel=mongoose.model('Booking',bookingSchema)
module.exports=bookingModel