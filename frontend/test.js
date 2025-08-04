
import { AuthContext } from "./context/AuthContext";
import assets, { messagesDummyData } from "./src/assets/assets";
import { useContext, useEffect } from "react";

{
    messagesDummyData.map((msg,index)=>{
        <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9'
            && 'flex-row-reverse'}`}>
                {
                    msg.image ? (
                        <img src={msg.image} className="max-w-[230px] border border-gray-700 rounded-lg
                        overflow-hidden mb-8"/>): (
                            <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg
                            mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === "680f50e4f10f3cd28382ecf9" ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                            {msg.text}</p>    
                       )
                }

                <div className="text-center text-xs">
                    <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon : assets.profile_martin }
                    className="w-7 rounded-full"/>
                    <p className="text-gray-500">{msg.createdAt}</p>
                </div>
        </div>
    })
}





{
    import {createContext, useState } from "react";
    import axios from "axios";
    import toast from "react-hot-toast";
    import {io} from 'socket.io-client'

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    axios.default.baseURL = backendUrl;

    export const AuthProvider = ({ children })=>{
        
        const [ token , setToken ] = useState(localStorage.getItem("token"));
        const [ authUser , setAuthUser ] = useState(null);
        const [ onlineUser , setOnlineUsers ] = useState([]);
        const [ socket , setSocket ] = useState(null)


        //Check if user is authenticated and if so, set the user data and connect
        // the socket

        const checkAuth = async ()=>{
            try {
                const { data } = await axios.get('/api/auth/check')
                if(data.success){
                    setAuthUser(data.user)
                    connectSocket(data.user)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        // Login function to handle user authentication and socket connection 

        const login = async (state, credentials)=>{
            try {
                const {data} = await axios.post(`/api/auth/${state}`, credentials);
                if(data.success){
                    setAuthUser(data.userData);
                    connectSocket(data.userData);
                    // Adds the token to all future axios headers.
                    axios.defaults.headers.common['token'] = data.token;
                    setToken(data.token);
                    localStorage.setItem("token",data.token)
                    toast.success(data.message)
                }else{
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(data.message)
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
            if(!userData || socket?.connected) return;
            const newSocket = io(backendUrl, {
                query : {
                    userId : userData._id,
                }
            });
            newSocket.connect();
            setSocket(newSocket);

            newSocket.on("getOnlineUsers",(userIds)=>{
                setOnlineUsers(userIds)
            })
        }

        useEffect(()=>{
            if(token){
                axios.defaults.headers.common["token"] = token; 
            }
            checkAuth()
        },[])



        const value = {
            axios,authUser , onlineUser , socket , login , logout , updateProfile
        }

        return (
            <AuthContext.Provider value={value}>
                {children}
            </AuthContext.Provider>
        )
    }
}

// ChatContext 

{
    import { createContext } from "react";

    export const ChatContext = createContext();
    
    export const ChatProvider = ({children}) =>{

        const [message , setMessage] = useState([]);
        const [user, setUsers] = useState([]);
        const [selectedUser , setSelectedUser] = useState(null);
        const [unseenMessage , setUnseenMessage] = useState({})
        const {socket , axios } = useContext(AuthContext);    
       
        // function to get alll users for sidebar 

        const getUsers = async()=>{
            try {
               const {data} = await axios.get('/api/messages/users')
               if(data.success){
                setUsers(data.users)
                setUnseenMessage(data.unseenMessage)
               } 
            } catch (error) {
                console.log(error)
                toast.error(error.message)
            }
        }

        // Function to get messages for selected users 
        const getMessages = async(userId)=>{
            try {
                const {data} = await axios.get(`/api/message/${userId}`)
                if(data.success){
                    setMessage(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        // function to send message to selected User 
        const sendMessage = async (messageData)=>{
            try {
                const {data} = await axios.post(`/api/message/send/${selectedUser._id}`,messageData)
                if(data.success){
                    setMessage((prevMessage)=>[...prevMessage, data.newMessage])
                }else{
                    toast.error(data.message)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }
        
        // function to subscribe to messages fpr selected User 

        const subscribeToMessage = async ()=>{
            if(!socket) return

            socket.on('newMessage',(newMessage)=>{
                if(selectedUser && newMessage.senderId === selectedUser._id){
                    newMessage.seen = true;
                    setMessage((prevMessage)=>[...prevMessage , newMessage])
                    axios.put(`/api/message/mark/${newMessage._id}`)
                }else{
                    setUnseenMessage((prevUnseenMessages)=>({
                        ...prevUnseenMessages , [newMessage.senderId] : 
                        prevUnseenMessages[newMessage.sendId] ? prevUnseenMessages
                        [newMessage.sendId] + 1 : 1
                    }))
                }
            })
        }

        // function to unsubscribe from message
        const unSubscribeFromMessage = ()=>{
            if(socket) socket.off("newMessage")
        }


        useEffect(()=>{
            subscribeToMessage();
            return ()=> unSubscribeFromMessage();
        },[socket, selectedUser])

        const value = {
            message , user , selectedUser , getUsers , setMessage , sendMessage , setSelectedUser , unseenMessage ,
            setUnseenMessage
        }
    
        return (
            <ChatContext.Provider value={value}>
                {children}
            </ChatContext.Provider>
        )
    }


}