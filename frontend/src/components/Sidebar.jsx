import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'
import assets from '../assets/assets'

const Sidebar = () => {
  const navigate = useNavigate()
  const { logout , onlineUsers } = useContext(AuthContext) 

  const { getUsers , users , selectedUser , setSelectedUser 
    , setUnseenMessage  ,unseenMessage} = useContext(ChatContext);


  const [searchInput , setSearchInput ]  = useState('') 

  // Filter the users based on the search input text
  const filterUsers = searchInput ? 
   users.filter((user)=>
    user.fullName.toLowerCase().includes(searchInput.toLowerCase())
   ): users

  // useEffect hook runs when the 'onlineUsers' state changes
  useEffect(()=>{
     // Call the getUsers function to fetch all users from the backend // It also fetches unseen messages for the logged-in user
    getUsers();
  },[onlineUsers]) 

  return (
   <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-hidden text-white 
   ${selectedUser ? "max-md:hidden" : ' '} `}>
      <div className='pb-5'>
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40'/>
          <div className='py-2 relative group'>
            <img src={assets.menu_icon} alt="menu-icon" className='max-h-5 cursor-pointer'/>
            <div className='absolute w-32 p-5 rounded-md border border-gray-600 bg-[#282142] text-gray-100 top-full right-0 z-20 hidden group-hover:block'>
              <p onClick={()=>(navigate('/profile'))} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={()=>logout()} className='cursor-pointer text-sm' >Logout</p>
            </div>
          </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="" className='w-3'/>
          <input onChange={(e)=>setSearchInput(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] 
           flex-1' placeholder='Search User...'/>
        </div>
        
      </div>
      
      
      <div className='flex flex-col'>
        {filterUsers.map((user,index)=>(
          <div onClick={() => { setSelectedUser(user); setUnseenMessage((prev) => ({...prev,[user._id]: 0,}));}} key={index} 
          className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}>
            {/* // This means if user profile is available then user.profilePic otherwise assests.avatar_icon */}
            <img src={user?.profilePic || assets.avatar_icon} alt="profilepic" className='w-[35px] aspect-[1/1] rounded-full'/>
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
                {
                  onlineUsers.includes(user._id) 
                  ? <span className='text-green-400 text-xs'>Online</span> 
                  : <span className='text-neutral-400 text-xs'>Offline</span>
                }
            </div>
            {
              selectedUser ? null : unseenMessage[user._id] > 0 && <p className='flex justify-center items-center rounded-full absolute top-4 
              right-4 text-xs h-5 w-5 bg-violet-500/50' >{unseenMessage[user._id]}</p>
            }
          </div>
          ))}
      </div>
   </div>
  )
}

export default Sidebar