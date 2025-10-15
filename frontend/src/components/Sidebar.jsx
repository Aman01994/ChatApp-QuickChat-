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

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput , setSearchInput ]  = useState('') 
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

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
      <div
        className={`h-full w-full bg-gradient-to-b from-[#0f0f10] to-[#1a1a1f] shadow-2xl rounded-r-2xl overflow-y-hidden text-white font-[Inter,sans-serif] transition-all duration-300
        ${selectedUser ? "max-md:hidden" : ''}`}
        style={{backdropFilter: 'blur(8px)'}}
      >
        {/* Header */}
        <div className="pb-6 pt-4 px-4 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <img
              src={assets.logo}
              alt="logo"
              className="max-w-36 drop-shadow-lg select-none"
              style={{filter: 'drop-shadow(0 0 8px #7c3aed44)'}}
            />
            <div className="relative menu-container">
              <button
                type="button"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen(prev => !prev)}
                className="p-2 rounded-full bg-[#181825]/70 hover:shadow-[0_0_12px_2px_#7c3aed55] transition-all duration-200 focus:outline-none"
              >
                <img
                  src={assets.menu_icon}
                  alt="menu-icon"
                  className={`max-h-5 cursor-pointer transition-transform duration-200 ${isMenuOpen ? 'scale-110' : ''}`}
                  style={{filter: 'drop-shadow(0 0 6px #7c3aed88)'}}
                />
              </button>

              <div
                className={`absolute w-40 right-0 top-12 z-30 rounded-xl border border-white/10 bg-[#181825]/80 shadow-xl backdrop-blur-md text-gray-100 transition-all duration-200 ${isMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                style={{boxShadow: '0 8px 32px 0 #7c3aed22'}}
              >
                <div className="flex flex-col gap-2 p-4">
                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); navigate('/profile'); }}
                    className="text-left cursor-pointer text-sm hover:text-violet-400 transition-colors"
                  >Edit Profile</button>
                  <hr className="my-1 border-t border-white/10" />
                  <button
                    type="button"
                    onClick={() => { setIsMenuOpen(false); logout(); }}
                    className="text-left cursor-pointer text-sm hover:text-violet-400 transition-colors"
                  >Logout</button>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#1c1c24]/80 border border-white/10 shadow-inner backdrop-blur-md mt-2 focus-within:shadow-[0_0_0_2px_#7c3aed55] transition-all duration-200"
          >
            <img src={assets.search_icon} alt="" className="w-4 opacity-80" />
            <input
              onChange={e => setSearchInput(e.target.value)}
              type="text"
              className="bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1 font-medium tracking-wide px-1"
              placeholder="Search User..."
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex flex-col gap-1 px-2 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#232336] scrollbar-track-transparent h-[calc(100%-160px)]">
          {filterUsers.map((user, index) => {
            const isActive = selectedUser?._id === user._id;
            const isOnline = onlineUsers.includes(user._id);
            return (
              <div
                onClick={() => {
                  setSelectedUser(user);
                  setUnseenMessage(prev => ({ ...prev, [user._id]: 0 }));
                }}
                key={index}
                className={`relative flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 select-none
                  ${isActive ? 'bg-[#2a2a32]/80 border-l-4 border-violet-500 shadow-[0_2px_16px_0_#7c3aed22]' : 'hover:bg-[#181825]/80 hover:shadow-[0_0_8px_0_#7c3aed33]'}
                  max-sm:text-sm`}
                style={{
                  transform: isActive ? 'scale(1.03)' : undefined,
                  boxShadow: isOnline ? '0 0 0 2px #06b6d4cc' : undefined,
                }}
              >
                <div className="relative">
                  <img
                    src={user?.profilePic || assets.avatar_icon}
                    alt="profilepic"
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#232336] shadow-md"
                    style={isOnline ? { boxShadow: '0 0 0 2px #06b6d4, 0 0 12px 2px #06b6d488' } : {}}
                  />
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_#06b6d4] border-2 border-[#181825]" />
                  )}
                </div>
                <div className="flex flex-col leading-5 flex-1 min-w-0">
                  <p className="truncate font-medium text-base text-white/90">{user.fullName}</p>
                  <span className={`text-xs ${isOnline ? 'text-cyan-400' : 'text-neutral-400'}`}>{isOnline ? 'Online' : 'Offline'}</span>
                </div>
                {/* Unread badge */}
                {!isActive && unseenMessage[user._id] > 0 && (
                  <span
                    className="ml-auto px-2 py-0.5 rounded-full bg-violet-600/70 text-xs font-semibold text-white shadow-[0_0_8px_2px_#7c3aed88] animate-pulse"
                    style={{filter: 'drop-shadow(0 0 6px #7c3aed)'}}
                  >
                    {unseenMessage[user._id]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default Sidebar