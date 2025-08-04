import express from 'express';
const userRouter = express.Router();
import { checkAuth, login, signup, updateProfile } from '../controllers/userController.js'
import { protectRoute } from '../mwfn/auth.js';



userRouter.post('/signup',signup)
userRouter.post('/login',login)
userRouter.put('/update-profile',protectRoute , updateProfile)
userRouter.get("/check",protectRoute , checkAuth)


export default userRouter