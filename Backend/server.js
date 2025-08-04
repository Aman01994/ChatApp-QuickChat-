import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import http from 'http'
import {ConnectDb} from './src/config/Mongodb.js'
import { protectRoute } from './src/mwfn/auth.js'
import userRouter from './src/routes/userRoute.js'
import bodyParser from 'body-parser';
import messageRouter from './src/routes/messageRoute.js'
import {Server} from 'socket.io';

await ConnectDb()


// Create Express app and Http Server 
const app = express()
const server = http.createServer(app)


// Initialize Socket.io server 
export const io = new Server(server,{
    cors:{ origin :'*'}
})


// store online users 
export const userSocketMap = {}; //{ userId : socketId}

// io handles global server events.

// socket handles per-user events.

// Difference between socket.handshake.query.userId vs socket.id
// userId = your Aadhaar number (fixed for you).
// socket.id = your ticket number when you join a queue (changes every time you join).

// Socket.io coneection handler 
io.on("connection",(socket)=>{
    // Get userId from client's handshake query (when they connect)
    const userId = socket.handshake.query.userId;
    // Log user connection
    console.log("User Connected" , userId)

    // If userId exists (i.e., client sent it correctly)
    if(userId) {
        // Save user's socket ID in the map to track they're online
        userSocketMap[userId] = socket.id;
        
         // Notify all connected clients with the list of online user IDs
        //   It takes an object as an argument and returns an array of that object’s keys (i.e., the property names). 
        io.emit('getOnlineUsers',Object.keys(userSocketMap)) 


         // When this socket disconnects (user closes tab, leaves app, etc.)
        socket.on("disconnect",()=>{
            // Log user disconnection
            console.log('User Disconnected', userId);
            // Remove user from the online users map
            delete userSocketMap[userId];
            // Notify all clients again with the updated online users list
            io.emit('getOnlineUsers',Object.keys(userSocketMap))
        })
    }
})

app.use(bodyParser.json({ limit: '4mb' }));


// Middleware setup 
app.use(cors())
app.use(express.json({ limit: '4mb' }))


// Routes setup 

app.use('/api/status', (req, res) => {
    res.send("Server is live")
})

app.use('/api/auth',userRouter)

app.use('/api/message',messageRouter)

// As we are using socket.io, we need to use the http server instead of the express app directly for listening to requests.
// This is because socket.io needs to handle WebSocket connections, which require the HTTP server instance
// And that is why we are using `server.listen` instead of `app.listen`. and in production we will use the PORT from environment variables.

if(process.env.NODE_ENV === 'production') {
    const Port = process.env.PORT || 4000
server.listen(Port, () => {
    console.log(`This server is running on ${Port}`)
})
}


export default server

