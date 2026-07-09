const jwt=require('jsonwebtoken')
const user=require('../models/User.model')
const authorizaton=async (req,res,next)=>{
    const authHeader = req.headers.authorization;

  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(400).json({
            message:"Not authorized, no token"
        })
    }

    try {
        const decoded=jwt.verify(token,process.env.generateToken)
        req.user=await user.findById(decoded.id)
        if(!req.user){
            return res.status(400).json({
            message:"user not longer exists"
        })
        }
        next()
        
    } catch (error) {
       return res.status(401).json({ message: 'Not authorized, token invalid' });
        
    }
}

const requireRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
             return res.status(401).json({ message: 'Not have access to this role' });
        }
    }
    next()

}

module.exports={authorizaton,requireRoles}