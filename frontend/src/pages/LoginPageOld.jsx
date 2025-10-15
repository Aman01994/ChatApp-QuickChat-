import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currentState, setCurrentState] = useState('Login');
  const [fullName,setFullname] = useState('')
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [bio, setBio]= useState('')
  const [isDataSubmitted,setIsDataSubmitted] = useState(false);
  const {login} = useContext(AuthContext)

  const onSubmitHandler =(e)=>{
    e.preventDefault();

   if (currentState === "Sign up") {
      if (!isDataSubmitted) {
        setIsDataSubmitted(true);
        console.log("tiggered");
        login("signup", { fullName, email, password, bio });
        
      }
    } else {
      login("login", { email, password });
    }
  }
  

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8
    sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left  */}
        <img src={assets.logo_big}  alt="" className='w-[min(30vw,250px)]'/>
      {/* right  */}
      <form onSubmit={(e)=>onSubmitHandler(e)} className='border-2  bg-[#8185B2]/10 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg
      shadow-lg '>
        <h2 className='font-medium text-2xl flex justify-between items-center '>{currentState}
        {/* <img src={assets.arrow_icon} alt=""  className='w-5 cursor-pointer'/> */}
        {
          isDataSubmitted &&
          <img src={assets.arrow_icon} alt="back" onClick={()=>{setIsDataSubmitted(false)}} className='w-5 cursor-pointer'/>
        }
        </h2>
        {
          currentState === 'Sign up' && !isDataSubmitted &&
            <input type="text" onChange={(e)=>(setFullname(e.target.value))} value={fullName} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus"ring-indigo-500 bg-[#8185B2]/10'   placeholder='Full Name' required/>
        } 

       
        
        {
          !isDataSubmitted &&
          <>
            <input type="email" onChange={(e)=>(setEmail(e.target.value))} value={email} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus"ring-indigo-500 bg-[#8185B2]/10' placeholder='Email Address' required/>
            <input type="password" onChange={(e)=>(setPassword(e.target.value))} value={password} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus"ring-indigo-500 bg-[#8185B2]/10' placeholder='Password' required/>
          </>
        }

        {
          currentState === "Sign up" && isDataSubmitted &&
          <textarea onChange={(e)=>setBio(e.target.value)} value={bio} rows={4} className='p-2 border bg-transparent rounded-md text-white  focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...' required></textarea>
        }

        <button type='submit' className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState === 'Sign up' ? "Create Account" : "Login here"}
        </button>
       
           <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
                


        <div className='flex flex-col gap-2'>
          {currentState === "Sign up" ? 
           <p className='text-sm text-gray-600'>Already have an account? <span className='font-medium text-violet-500 cursor-pointer' onClick={()=>{setCurrentState('Login') ; setIsDataSubmitted(false)}}>Login here</span></p>
          :<p className='text-sm text-gray-600'>Create an account <span className='font-medium text-violet-500 cursor-pointer' onClick={()=>(setCurrentState('Sign up'))}>Click here</span></p>   
          }
        </div>

      </form>
    </div>
  )
}

export default LoginPage