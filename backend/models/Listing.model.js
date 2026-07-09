const mongoose=require('mongoose')

const serviceSchema=new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    type: { type: String, enum: ['product', 'service'], required: true },
    title:{type:String,required:true,unique:true},
    description: {
        type:String,
        required:true
    }, 
pricing: {
    type:Number,
    required:true
},
deliveryTime: {
    type:String
}, 
availability: {
    type:Boolean
},
location: {
    type:String

},
images: [{ type: String }],
serviceCategory :{
    type:String,
    required:true
},
stock: Number,
status: { type: String, enum: ['active', 'pending', 'removed'], default: 'active' }

},{timestamps:true})
const serviceModel=mongoose.model("Listing",serviceSchema)

module.exports=serviceModel