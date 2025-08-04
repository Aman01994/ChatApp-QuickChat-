import React, { useContext, useEffect, useRef, useState } from 'react'
import assets, { messagesDummyData, userDummyData } from '../assets/assets'
import { formatMessageTime } from '../lib/utilies'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'



const ChatContainer = () => {

  const scrollEnd = useRef()



  const { selectedUser , setSelectedUser , message , setMessage ,sendMessage , getMessage}  = useContext(ChatContext);
  const { authUser , onlineUsers } = useContext(AuthContext)

  const [messageInput, setMessageInput] = useState("")


  const handleSendMessage = async (e)=>{
      e.preventDefault;
      if(messageInput.trim() === '') return null
      await sendMessage({text : messageInput.trim()})
      setMessageInput("")
  }
  const handleSendImg = async (e)=>{
    const file = e.target.files[0];
    file.type
      // Explaination 
      // This is a string representing the MIME type of the file. For example:
      // "image/png"
      // "image/jpeg"
      // "application/pdf"
      // file.type.startsWith("image/")
    if(!file || !file.type.startsWith("image/")){
      toast.error('Select an image file')
      return
    }

    const reader = new FileReader() // Create FileReader to read the file

    reader.onloadend = async ()=>{                 // Callback runs when file reading is finished
      await sendMessage({image : reader.result})  // Send base64 image after reading
      e.target.value = ''
    }
    
    reader.readAsDataURL(file) // Start reading file as base64 (Data URL)
  }

  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior: "smooth"})
    }
    
  },[message])

  useEffect(()=>{
    if(selectedUser){
        getMessage(selectedUser._id)
    }
    console.log(selectedUser)
    console.log(message)
  },[selectedUser ])

  return selectedUser ?  (
    <div className='backdrop-blur-lg overflow-scroll h-full relative '>
        {/* Chat box header  */}
        <div className='flex items-center border-b border-stone-500 mx-4 py-3 gap-3 '>
          <img src={selectedUser.profilePic ? selectedUser.profilePic :assets.avatar_icon  } alt="" className='w-8 rounded-full' />
          <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser.fullName}
            {
              onlineUsers.includes(selectedUser._id) ?<span className='w-2 h-2 rounded-full bg-green-500'></span> :
              null
            } 
          </p>
          <img onClick={()=>setSelectedUser(null)} src={assets.arrow_icon} className='max-w-7 md:hidden cursor-pointer' alt="" />
          <img src={assets.help_icon} className='hidden max-w-5 sm:hidden md:block cursor-pointer'  alt="" />
        </div>

        {/* Chat box header ends */}
          {/* // Chat Area  */}

        <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
          {
            message.map((msg,index)=>(
              <div key={index} className={`flex items-end gap-2 justify-end  ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
                {
                  msg.image ? (<img src={msg.image} className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8'/>):
                  (<p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 bg-violet-500/30 text-white break-all
                  ${msg.senderId === authUser._id ? 'rounded-br-none': 'rounded-bl-none'}`}>{msg.text}</p>)
                }
                <div className='text-xs'>
                  <img src={msg.senderId === authUser._id ? authUser.profilePic : selectedUser.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
                  <p className='text-gray-500'>{formatMessageTime(msg.createdAt)}</p>
                </div>
              </div>
            ))
          }



          <div ref={scrollEnd}></div>
        </div>
          {/* bottom  */}
        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
          <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full  bg-violet-500/10'>
            <input
              onChange={(e)=>setMessageInput(e.target.value)}
              onKeyDown={(e)=> e.key === "Enter" ? handleSendMessage(e) : null}
              value={messageInput}
              type="text"
              placeholder='Send a message'
              className='flex-1 p-3 text-sm border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
            />
            <input onChange={handleSendImg} type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image">
              <img src={assets.gallery_icon} className='w-5 mr-2 cursor-pointer' />
            </label>
          </div>

          <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-7 cursor-pointer' />
        </div>
    </div>


    
  ): (
    <div className='flex flex-col items-center justify-center gap-3'>
      <img src={assets.logo_icon} className='max-w-16' alt="" />
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer