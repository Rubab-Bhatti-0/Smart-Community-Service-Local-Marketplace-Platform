const mongoose=require('mongoose')

const messageSchema=new mongoose.Schema({
        sender:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
        conversation:{type:mongoose.Schema.Types.ObjectId,ref:'Conversation',required:true},
        text:{type:String},
        imageUrl: { type: String },
        read: { type: Boolean, default: false }

},{timestamps:true})

const messageModel=mongoose.model('Message',messageSchema)
module.exports=messageModel