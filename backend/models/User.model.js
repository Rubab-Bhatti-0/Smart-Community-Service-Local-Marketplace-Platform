const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({

    picture: {
        type:String
    }, 
    name: {
        type:String,
        required:true,trim: true
    },
    email:{
        type:String,
        required:true,
        unique:true

    }, 
    password:{
        type:String,
        required:true,
        minlength:8

    },
    role:{
        type:String,
        enum:['buyer','admin','seller'],
        default:'buyer'

    },
    bio: {
        type:String,
        default:''
    }, 
    contact: {
        type:String,
        default:''
    },
location: {
    type:String,
    default:''
}, 
services: [{
    type:String

}],
ratingAvg: {
    type:Number,
    default:0

},
ratingCount: {
    type:Number,
default:0
},
isSuspended:{
    type:Boolean,
    default:false
}

},{timestamps:true})
const userModel=mongoose.model("User",userSchema)

module.exports=userModel