const user=require('../models/User.model')
const bcrypt=require('bcryptjs')
const generateToken=require('../utils/generateToken')
const registerUser=async(req,res)=>{
    try{

    
    const {Name,email,password,role}=req.body;
    if(!Name || !password || !role || !email){
        return res.status(400).json({
            message:"Enter credentials"
        })
    }
    const isEmailExist=await user.findOne({email})
    if(isEmailExist){
        return res.status(400).json({
            message:"There is already an account on this email."
        })

    }
    const salt= await bcrypt.genSalt(10);
    const hashpass=await bcrypt.hash(password,salt)
    const u=await user.create({
        Name,
        email,
        password:hashpass,
        role:role || 'buyer'
    })

    const token=generateToken(u._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

}catch(err){
    res.status(500).json({ message: err.message })
}


}

const loginUser=async(req,res)=>{
    try{

    const {email, password}=req.body;
    if(!email || !password){
         return res.status(400).json({
            message:"Enter credentials"
        })
    }
    const isEmailExist=await user.findOne({email})
    if(!isEmailExist){
        return res.status(400).json({
            message:"Invalid credentials, check email and password"
        })
    }
    const u=await user.findOne({email}).select('+password')
    if (!u) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if(u.isSuspended){
        return res.status(403).json({ message: 'Account suspended!' });
    }

    const decoded=await bcrypt.compare(password,u.password)
    if(!decoded){
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token=generateToken(u._id);
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getMe = async (req, res) => {
  // req.user is set by the auth middleware (next block)
  res.status(200).json({ user: req.user });
};

module.exports={registerUser,loginUser,getMe}