import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { io } from "socket.io-client";
import toast from "react-hot-toast";
const backendUrl = import.meta.env.VITE_BACKEND_URL
// ADD backendUrl as back url in axios so that we can we axios.get('/api/user') instend of axios.get('backendUrl/api/user')
axios.defaults.baseURL= backendUrl ;



export const AuthContext = createContext();

export const AuthProvider = ({children})=>{

    const [token , setToken ] = useState(localStorage.getItem('token'));
    const [authUser , setAuthUser ] = useState(null);
    const [ onlineUsers , setOnlineUser ] = useState([]);
    const [socket , setSocket]  = useState(null);
    
    // Check if User is authenticated and if so, set the user data and connect the socket

    const checkAuth = async ()=>{
        try {
            const { data } = await axios.get("/api/auth/check")
            if(data.success){
                setAuthUser(data.user)
                connectSocket(data.user)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Login function to handle user authentication and socket connection 

    const login = async(state,credentials)=>{
        try {
            const {data} = await axios.post(`/api/auth/${state}`,credentials)
             if(data.success){
                console.log(data)
                setAuthUser(data.userData);
                connectSocket(data.userData); //  We'll check the issue later
                 // Adds the token to all future axios headers.
                axios.defaults.headers.common['token'] = data.token;
                setToken(data.token);
                localStorage.setItem("token",data.token)
                toast.success(data.message)
            }else{
                    toast.error(data.message)
                }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
       
    }

     // Logout function to handle user logout and socket disconnection 
    
        const logout = async ()=>{
            localStorage.removeItem('token');
            setToken(null);
            setAuthUser(null);
            setOnlineUser([]);
            axios.defaults.headers.common['token'] = null;
            toast.success('Logged out successfully')
            socket.disconnect()
        }


    // Update profile function to handle user profile updates
    
        const updateProfile = async(body)=>{
            try {
                const {data} = await axios.put("/api/auth/update-profile",body);
                if(data.success){
                    setAuthUser(data.user);
                    toast.success('Profile updated successfully')
                }
            } catch (error) {
                toast.error(error.message)
            }
        }


     // Connect socket function to handle socket connection and online users updates
        const connectSocket =(userData)=>{
            // If userData is not provided or socket is already connected, stop further execution
            if(!userData || socket?.connected){
                console.log(`Something went wrong`)
                return;

            } 
            // Create a new socket instance and pass the user ID as a query parameter
            const newSocket = io(backendUrl, {
                query : {
                    userId : userData._id, // Attach user's ID so server knows who's connecting
                }
            });
             // Manually initiate the socket connection
            newSocket.connect();
             // Save the new socket instance to state (or context) using setSocket
            setSocket(newSocket);
            // Listen for 'getOnlineUsers' event from the server
            newSocket.on("getOnlineUsers",(userIds)=>{
                 // When server sends online user IDs, update them in the client state
                setOnlineUser(userIds)
            })
        }

        
        
    useEffect(()=>{
        if(token){
            axios.defaults.headers.common['token'] = token;
        }
        checkAuth()
    },[])

    const value = {
         axios,authUser , onlineUsers , socket , login , logout , updateProfile
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}