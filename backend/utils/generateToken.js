const webtoken=require('jsonwebtoken')

const generateToken=(userID)=>{
    return webtoken.sign({id:userID},process.env.generateToken,{
        expiresIn:process.env.expires_in
    })
}

module.exports=generateToken;
