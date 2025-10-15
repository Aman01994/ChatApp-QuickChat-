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

    return selectedUser && (
      <div
        className={`w-full h-full bg-gradient-to-b from-[#0f0f10] to-[#1a1a1f] text-white relative flex flex-col overflow-y-hidden font-[Inter,sans-serif] transition-all duration-300 ${selectedUser ? "max-md:hidden" : ""}`}
        style={{backdropFilter: 'blur(8px)'}}
      >
        {/* Header section */}
        <div className="flex flex-col items-center pt-10 pb-6 px-4">
          <div className="relative mb-4">
            <img
              className="w-24 h-24 rounded-full object-cover shadow-[0_0_20px_rgba(124,58,237,0.3)] border-4 border-[#181825]"
              src={selectedUser?.profilePic || assets.avatar_icon}
              alt="profile"
              style={{boxShadow: '0 0 20px 0 #7c3aed55'}}
            />
            {/* Online status dot */}
            <span
              className={`absolute bottom-2 right-2 w-4 h-4 rounded-full border-2 border-[#181825] ${onlineUsers.includes(selectedUser._id)
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                : 'bg-gray-500 shadow-[0_0_8px_rgba(156,163,175,0.4)]'}`}
              style={{boxShadow: onlineUsers.includes(selectedUser._id) ? '0 0 8px 2px #34d39999' : '0 0 8px 2px #6b728099'}}
            />
          </div>
          <h1 className="text-2xl font-semibold flex items-center gap-2 mb-1 text-white/90 tracking-wide drop-shadow-lg">
            {selectedUser.fullName}
          </h1>
          <p className="text-sm text-gray-300 text-center max-w-xs mb-2 px-2" style={{textShadow: '0 1px 8px #181825'}}> {selectedUser.bio} </p>
        </div>

        {/* Divider */}
        <hr className="border-[#ffffff18] mx-6 my-2" />

        {/* Media section */}
        <div className="flex-1 px-6 pb-28 pt-2 overflow-y-auto">
          <p className="text-xs text-gray-400 mb-2 tracking-wider font-semibold uppercase">Media</p>
          <div className="grid grid-cols-2 gap-3 rounded-md bg-white/5 p-2 max-h-[220px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#232336] scrollbar-track-transparent">
            {imageMessage.length === 0 && (
              <span className="col-span-2 text-center text-gray-500 py-6">No media shared yet.</span>
            )}
            {imageMessage.map((url, index) => (
              <div
                key={index}
                onClick={() => window.open(url)}
                className="rounded-lg overflow-hidden cursor-pointer shadow-[0_2px_12px_0_#7c3aed22] bg-[#232336]/40 transition-all duration-200 hover:scale-105 hover:shadow-[0_0_16px_2px_#7c3aed55]"
                style={{backdropFilter: 'blur(2px)'}}
              >
                <img
                  src={url}
                  alt="media"
                  className="w-full h-28 object-cover rounded-md transition-all duration-200"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => logout()}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-purple-500 hover:brightness-110 transition-all duration-200 rounded-full py-2 px-16 text-white text-base font-medium shadow-[0_2px_16px_0_#7c3aed44] focus:outline-none"
          style={{boxShadow: '0 2px 16px 0 #7c3aed44'}}
        >
          Logout
        </button>
      </div>
    );
}

export default RightSidebar