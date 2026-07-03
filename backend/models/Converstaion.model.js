const mongoose=require('mongoose')

const conversationSchema=new mongoose.Schema({
            particpants=[{type:mongoose.Schema.Types.ObjectId,ref:user,required:true}],
            lastMessage:{type:String,default: '' }

},{timestamps:true})

const conversationModel=mongoose.model('Conversation',conversationSchema)
module.exports=conversationModel