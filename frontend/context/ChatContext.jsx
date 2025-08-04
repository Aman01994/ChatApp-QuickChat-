
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";



export const ChatContext = createContext();

export const ChatProvider = ({children}) =>{

    const [users,setUsers ] = useState([]);
    const [unseenMessage , setUnseenMessage ] = useState({})
    const [selectedUser , setSelectedUser] = useState(null)
    const [message , setMessage] = useState([])
    const {socket , axios } = useContext(AuthContext);    


    // Fetch Sidebar Users 
    const getUsers = async ()=>{
        try {
            const {data} = await axios.get("/api/message/users")
            if(data.success){
                setUsers(data.users)
                setUnseenMessage(data.unseenMessage)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Get Chatbox messages for selected User 
    const getMessage = async(userId)=>{
        try {
            const {data} = await axios.get(`/api/message/${userId}`)
            if(data.success){
                setMessage(data.messages)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const sendMessage = async(messageData)=>{
        try {
            const {data } = await axios.post(`/api/message/send/${selectedUser._id}`,messageData)
            if(data.success){
                setMessage((prevMessage)=>[...prevMessage , data.newMessage])
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const subscribeToMessage = async (socket)=>{
        try {
            if(!socket){
                console.log(`Socket is not connected`)
                return
            } 
              socket.on('newMessage',(newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true
                setMessage((prevMessage)=>[...prevMessage, newMessage])
                axios.put(`api/message/mark/${newMessage._id}`)
            }else{
                setUnseenMessage((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                        ? prevUnseenMessages[newMessage.senderId] + 1
                        : 1
                    }));
            }

            
        })
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

      
    }

    // function to unsubscribe from message
    const unSubscribeFromMessage = ()=>{
        if(socket) socket.off('newMessage')
    }

    useEffect(()=>{
        subscribeToMessage(socket);
        // return ()=> unSubscribeFromMessage();
    },[ socket , selectedUser ])


    
    const value = {
        message , users , selectedUser , getUsers , setMessage , 
        sendMessage , setSelectedUser , unseenMessage , setUnseenMessage , getMessage
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}