const webtoken=require('jsonwebtoken')

const generateToken=(userID)=>{
    let expiresIn = process.env.expires_in || '7d';
    if (/^\d+$/.test(expiresIn)) {
        expiresIn = `${expiresIn}d`;
    }
    return webtoken.sign({id:userID},process.env.generateToken,{
        expiresIn
    })
}

module.exports=generateToken;
