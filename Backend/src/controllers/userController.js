import cloudinary from "../config/Cloudinary.js";
import { generateToken } from "../config/Utils.js";
import User from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Sign up a new user 
export  const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        // Validate input
        if (!fullName || !email || !password || !bio) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "Account already exists" });
        }

        // Hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPass = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashPass,
            bio
        });

        const token = generateToken(newUser._id);

        // Avoid sending sensitive data
        const { password: pwd, ...userWithoutPassword } = newUser._doc;

        res.json({ success: true, userData: userWithoutPassword, token, message: "Registered Successfully" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// User Login 
export  const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const userData = await User.findOne({ email });
        if (!userData) {
            return res.json({ success: false, message: 'Invalid Credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Invalid Credentials" });
        }

        const token = generateToken(userData._id);

        const { password: pwd, ...userWithoutPassword } = userData._doc;

        res.json({ success: true, token, userData: userWithoutPassword, message: "Login Successful" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};


// Controller to check if user is athenticated // This is for the users profile details like bio, fullname and email profilePic
export const checkAuth =(req,res)=>{
    res.json({success:true,user:req.user})
}


//Controller to update user profle details 
export const updateProfile = async (req,res)=>{
    try {
        const {profilePic , bio, fullName} = req.body
        const userId = req.user._id

         // Step 1: Build dynamic update object
        let updatedUser = {};
        if(fullName) updatedUser.fullName = fullName
        if(bio) updatedUser.bio = bio

        // Step 2: Handle profilePic if provided
        if(profilePic){
            const upload = await cloudinary.uploader.upload(profilePic)
            updatedUser.profilePic = upload.secure_url;
            console.log(upload)
        }

         // Step 3: Update user with only the provided fields

        const uploadUser = await User.findByIdAndUpdate(userId,updatedUser, {new:true}).select('-password')

        res.json({ success: true, user: uploadUser });

    } catch (error) {
        console.log(error.message)
        res.json({success:false, message:error.message})
    }
}