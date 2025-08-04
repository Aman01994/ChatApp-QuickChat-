// import User from "../models/UserModel"
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'


export const protectRoute = async(req,res,next)=>{
    
    try {
        const token = req.headers['token']
        
        if(!token){
        res.json({success: false, message:"Not Working"})
        }
        const decodeUser = jwt.verify(token, process.env.JWT_SECRET)

        console.log(decodeUser)
        const user = await User.findById(decodeUser.userId).select('-password')
        // console.log("user ===>",user)
        if(!user){
            return res.json({success:false,message:"User not found"})
        }
        req.user = user
        console.log(user)
        next()
    } catch (error) {
        console.log(error)
        return res.json({success:false,message : error.message})
    }
} 