const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({

    Picture:{
        type:String
    }, 
    Name:{
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
    Bio:{
        type:String,
        default:''
    }, 
    Contact:{
        type:String,
        default:''
    },
Location:{
    type:String,
    default:''
}, 
Services:[{
    type:String

}],
RatingAvg:{
    type:Number,
    default:0

},
RatingCount:{
    type:Number,
default:0
},
isSuspended:{
    type:Boolean,
    default:false
}

},{timestamps:true})
const userModel=mongoose.model("user",userSchema)

module.exports=userModel