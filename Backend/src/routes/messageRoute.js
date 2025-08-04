import express from 'express';
const messageRouter = express.Router();

import { protectRoute } from '../mwfn/auth.js';
import { getMessage, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageController.js';



messageRouter.get("/users",protectRoute , getUsersForSidebar)
messageRouter.get("/:id",protectRoute,getMessage )
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen)
messageRouter.post("/send/:id",protectRoute,sendMessage)

export default messageRouter