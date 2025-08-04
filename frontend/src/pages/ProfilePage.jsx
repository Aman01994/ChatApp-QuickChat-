import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import axios from 'axios'

const ProfilePage = () => {
  
  const { authUser , updateProfile } = useContext(AuthContext)
  const [selectedImg,setSelectedImg] = useState(null)
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName)
  const [bio ,setBio] = useState(authUser.bio)


  const handleSubmit = async(e)=>{
    e.preventDefault()
    if(!selectedImg){
      await updateProfile({fullName : name, bio})
      navigate('/')
    }
    
    // If selectedImg exists (i.e., a file is selected in the input), then proceed to read and upload it

    // Step 1: Create a new FileReader instance
    const reader = new FileReader();
    // Step 2: Read the selected image file as a Base64 data URL
    reader.readAsDataURL(selectedImg);
    // Step 3: When file reading is complete, execute this function
    reader.onload = async () => {
      // Step 4: Get the Base64-encoded result (this is the image in string format)
      const base64Image = reader.result;
       // Step 5: Call updateProfile function to update user's profile picture and other details
    await updateProfile({profilePic: base64Image,fullName: name, bio});
    navigate('/')
    console.log('AuthUser====>>',authUser)
      }
    }

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
        <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex
        items-center justify-between max-sm:flex-col-reverse rounded-lg'>
          <form onSubmit={(e)=>handleSubmit(e)} className='flex flex-col gap-5 p-10 flex-1'>
            <h3 className='text-lg'>Profile details</h3>
            <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
              <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id='avatar' accept='.png, .jpg, .jpeg' hidden/>
              <img src={selectedImg ? URL.createObjectURL(selectedImg): assets.avatar_icon} alt="" 
              className={`w-12 h-12 rounded-full`} />
              upload profile image
            </label>

            <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='Your name' className='p-2  border border-gray-500
            rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent'/>

            <textarea onChange={(e)=>setBio(e.target.value)}value={bio}  placeholder='Write profile bio' required className='p-2 border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent' rows={4} ></textarea>

            <button type='submit' className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2
            rounded-full text-lg cursor-pointer'>Save</button>
          </form>

          <img className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10' src={authUser?.profilePic || assets.logo_icon} alt="" />
        </div>
    </div>
  )
}

export default ProfilePage