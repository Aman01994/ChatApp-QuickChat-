import { io ,  userSocketMap } from '../../server.js';
import cloudinary from '../config/Cloudinary.js';
import Message from "../models/Message.js";
import User from "../models/UserModel.js";




// get all user for the sidebar and unseen messages except the login user 
export const getUsersForSidebar = async(req,res)=>{
    try {
        // Get the ID of the currently logged-in user from auth.js token decode
        const userId = req.user._id
        // Fetch all users from the database **excluding** the logged-in user
        // `$ne` stands for "not equal"
        // `.select("-password")` excludes the password field from the result
        const filterdUsers =  await User.find({_id: {$ne : userId}}).select("-password")
        
        // Object to store the count of unseen messages for each user
        const unseenMessage = {}

        // For each user, find messages sent to the logged-in user that are not seen
        // This map returns an array of promises (one for each user)    
        const promise = filterdUsers.map(async (user)=>{
           const message = await Message.find({senderId : user._id,receiverId :userId ,seen : false })
            // If there are unseen messages, store the count in the `unseenMessage` object
            if(message.length > 0){
                unseenMessage[user._id] = message.length
            }
        })
        // Wait for all asynchronous operations (promises) to complete before proceeding
        await Promise.all(promise)
        // Send response with the filtered users and unseen message counts
        res.json({success:true, users: filterdUsers, unseenMessage})
    } catch (error) {
        console.log(error)
        res.json({success:false, message : error.message})
    }
}



export const getMessage = async (req,res)=>{
    try {
        // Get the ID of the selected user from the URL parameters and rename it to selectUserId
        const {id: selectUserId} = req.params;
        // Get the ID of the currently logged-in user
        const myId = req.user._id;


        // Fetch all messages between the logged-in user and the selected user
        const messages = await Message.find({
            $or:[
                {senderId : selectUserId , receiverId: myId}, // Messages where selected user sent to me
                {senderId : myId , receiverId: selectUserId}, // Messages where I sent to selected user
            ]
        })  

        // Mark all messages sent by the selected user to me as "seen"
        await Message.updateMany({senderId: selectUserId, receiverId: myId},{seen : true})
       
        // Send the messages as a response
        res.json({success:true, messages})
    } catch (error) {
        console.log(error)
        res.json({success:false, message : error.message})
    }
}


// / api to mark message as seen using message id 
export const markMessageAsSeen = async (req,res)=>{
    
    try {
    const {id} = req.params
    await Message.findByIdAndUpdate(id,{seen : true})
    res.json({success:true})

    } catch (error) {
        console.log(error)
        res.json({success:false, message : error.message})
    }
}


// send message to the selected user
export const sendMessage = async (req,res)=>{
   try {
    const {text,image} = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url;
    }
    
    const newMessage =  await Message.create({
        senderId, receiverId , text , image : imageUrl
    })

    // Get the receiver's socket ID from the userSocketMap
    // This tells us if the user is currently connected (online)
    const receiverSocketId = userSocketMap[receiverId];

    // If the receiver is online (i.e., socket ID exists)
    if(receiverSocketId){
        // Emit/send the new message to the specific socket ID of the receiver
        // This will trigger the "newMessage" event on the receiver's frontend in real-time
        io.to(receiverSocketId).emit("newMessage",newMessage)
    }

    res.json({success:true, newMessage})
   
    } catch (error) {
        console.log(error)
        res.json({success:false, message : error.message})
   }
}