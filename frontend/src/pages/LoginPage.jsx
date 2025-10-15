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

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === "Sign up") {
      if (!isDataSubmitted) {
        // First step: show bio input, do not send request yet
        setIsDataSubmitted(true);
      } else {
        // Second step: send signup request with bio
        login("signup", { fullName, email, password, bio });
      }
    } else {
      login("login", { email, password });
    }
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f10] via-[#141417] to-[#1a1a1f] flex items-center justify-center px-6 py-12 overflow-hidden relative animate-fadeIn">
      {/* Floating background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto flex lg:items-center lg:gap-12 max-w-6xl max-lg:flex-col">
        {/* Left side - Logo and tagline */}
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left mb-8 lg:mb-0 z-10">
          <img src={assets.logo_big} alt="Logo" className="w-[min(40vw,320px)] mb-6 drop-shadow-[0_0_15px_rgba(124,58,237,0.2)]" />
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
            Connect, Chat, Create
          </h1>
          <p className="text-gray-400 text-lg max-w-lg">
            Join our community and experience a new way of staying connected with friends and colleagues.
          </p>
        </div>

        {/* Right side - Auth form */}
        <div className="lg:w-1/2 w-full max-w-md mx-auto">
          <form onSubmit={(e)=>onSubmitHandler(e)} 
            className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-2xl
            shadow-[0_0_30px_rgba(124,58,237,0.15)] animate-fadeIn">
            
            {/* Header with back button */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">{currentState}</h2>
              {isDataSubmitted && (
                <button onClick={()=>{setIsDataSubmitted(false)}} 
                  className="p-2 rounded-full hover:bg-white/5 transition-colors">
                  <img src={assets.arrow_icon} alt="back" className="w-5 h-5 brightness-75 hover:brightness-100" />
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              {currentState === 'Sign up' && !isDataSubmitted && (
                <div className="relative">
                  <input 
                    type="text"
                    onChange={(e)=>setFullname(e.target.value)}
                    value={fullName}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent
                    transition-all duration-200"
                    placeholder="Full Name"
                    required
                  />
                </div>
              )}

              {!isDataSubmitted && (
                <>
                  <div className="relative">
                    <input 
                      type="email"
                      onChange={(e)=>setEmail(e.target.value)}
                      value={email}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent
                      transition-all duration-200"
                      placeholder="Email Address"
                      required
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="password"
                      onChange={(e)=>setPassword(e.target.value)}
                      value={password}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500
                      focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent
                      transition-all duration-200"
                      placeholder="Password"
                      required
                    />
                  </div>
                </>
              )}

              {currentState === "Sign up" && isDataSubmitted && (
                <div className="relative">
                  <textarea 
                    onChange={(e)=>setBio(e.target.value)}
                    value={bio}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500
                    focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-transparent
                    transition-all duration-200 resize-none"
                    placeholder="Tell us about yourself..."
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg py-3 px-6
                hover:brightness-110 transform hover:scale-[1.02] transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-violet-500/50 shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                {currentState === 'Sign up' ? "Create Account" : "Login"}
              </button>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-violet-500
                  focus:ring-violet-500/50 focus:ring-offset-0"
                />
                <p className="text-sm text-gray-400">
                  I agree to the Terms of Service and Privacy Policy
                </p>
              </div>

              {/* Switch between Login/Signup */}
              <div className="text-center mt-6">
                {currentState === "Sign up" ? (
                  <p className="text-gray-400">
                    Already have an account?{" "}
                    <button 
                      onClick={()=>{setCurrentState('Login'); setIsDataSubmitted(false)}}
                      className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                      Login here
                    </button>
                  </p>
                ) : (
                  <p className="text-gray-400">
                    New here?{" "}
                    <button 
                      onClick={()=>setCurrentState('Sign up')}
                      className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
                      Create an account
                    </button>
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage