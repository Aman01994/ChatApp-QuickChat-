import React, { use, useContext, useEffect, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const RightSidebar = () => {
  const { logout , onlineUsers} = useContext(AuthContext)
  
  const {selectedUser , message} = useContext(ChatContext)
  const [imageMessage ,setImageMessage  ]  = useState([])

  useEffect(()=>{
    // console.log("Selected User: ", selectedUser)

    setImageMessage(
      message.filter(msg => typeof msg.image === "string" && msg.image.trim() !== "").map(msg => msg.image)
      // message.filter(msg => msg.image).map(msg => msg.image)
      // message.filter(msg=>(console.log(typeof(msg.image))))
    )
    // console.log("imageMessage: ", Array.isArray(imageMessage))
    
  },[selectedUser, message])

  return selectedUser &&  (
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-hidden ${selectedUser ? "max-md:hidden" : ""}`}>
        
        {/* Header section  */}
        
        <div className='flex flex-col items-center py-10 '>
          <img className='w-20 aspect-[1/1] rounded-full' src={selectedUser?.profilePic || assets.avatar_icon} alt="" />
          <h1 className=' text-xl  font-medium px-10 mx-auto flex items-center gap-2'>
            
            {
              onlineUsers.includes(selectedUser._id) ? <p className='w-2 h-2 bg-green-500 rounded-full'></p>:
              <p className='w-2 h-2 bg-gray-500 rounded-full'></p>
            }
            {selectedUser.fullName}
            </h1>
            <p className='text-xs  px-10 mx-auto'>
              {selectedUser.bio}
            </p>
        </div>
              {/* Header section  */}
        <hr className='border-[#ffffff50] my-4 ' />

        {/* Media section  */}

        <div className='px-5 text-xs'>
          <p>Media</p>
          <div className='gap-4 opacity-80 grid grid-cols-2 max-h-[200px] mt-2 overflow-y-scroll'>
              {imageMessage.map((url,index)=>(
                  <div key={index} onClick={()=>window.open(url)} className='rounded cursor-pointer'>
                    <img src={url} alt="" className='h-full rounded-md'/>
                  </div>
              ))}
          </div>
        </div>

        <button onClick={()=>logout()} className='absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 
        to-violet-600 text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer'>Logout</button>
    </div>
  )
}

export default RightSidebar