const mongoose=require('mongoose')

const reviewSchema=new mongoose.Schema({
    buyer:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    seller:{type:mongoose.Schema.Types.ObjectId,ref:'user',required:true},
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    rating:{type:number,min:1,max:5,required:true},
    comment: { type: String }

},{timestamps:true})

const reviewModel=mongoose.model('Review',reviewSchema)
module.exports=reviewModel