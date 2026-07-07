const multer=require('multer')
const cloudinary=require('../config/cloudinary')
const {cloudinaryStorage}=require('multer-storage-cloudinary')

const storage=new cloudinaryStorage({
    cloudinary,
    params:{
        folder:'service-marketplace',
        allowed_formats:['jpg','png','jpeg','webp'],
        transformation:[{width:1200,height:1200,crop:'limit'}]

    }
})

const upload=multer({
    storage,
    limits:{fileSize: 5 * 1024 * 1024}
})

module.exports=upload