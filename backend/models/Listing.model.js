const mongoose=require('mongoose')

const serviceSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    type: { type: String, enum: ['product', 'service'], required: true },
    title:{type:String,required:true,unique:true},
    Description:{
        type:String,
        required:true
    }, 
Pricing :{
    type:Number,
    required:true
},
Delivery_Time:{
    type:String
}, 
Availability :{
    type:Boolean
},
Images:[{type:String}] ,
serviceCategory :{
    type:String,
    required:true
},
Stock:Number,
 status: { type: String, enum: ['active', 'pending', 'removed'], default: 'active' }

},{timestamps:true})
const serviceModel=mongoose.model("user",serviceSchema)

module.exports=serviceModel