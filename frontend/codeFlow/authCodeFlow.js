                                // ✅ Summary Flow

                                // Mount App 
                                //   ↓
                                // checkAuth() via useEffect
                                //   ↓
                                // If already logged in → set user + connect socket
                                // OR
                                // User logs in manually → login() → same process
                                //   ↓
                                // Live updates via socket for online users
                                //   ↓
                                // Logout → cleanup everything                           




// ---------------------------------------------------------------------- 
// ------------------------------------------------------------------------ 
                           
                           
                           //AuthProvider

                    //        ┌────────────────────────┐
                    //        │ App Starts / Reloaded  │
                    //        └──────────┬─────────────┘
                    //                   │
                    //    ┌──────────────▼──────────────┐
                    //    │  useEffect runs on mount    │
                    //    │ ─────────────────────────── │
                    //    │  1. Set token in axios      │
                    //    │  2. Call checkAuth()        │
                    //    └──────────────┬──────────────┘
                    //                   │
                    //      ┌────────────▼────────────┐
                    //      │ checkAuth()             │
                    //      │ ──────────────────────  │
                    //      │  GET /api/auth/check    │
                    //      │  if success:            │
                    //      │    setAuthUser(user)    │
                    //      │    connectSocket(user)  │
                    //      └────────────┬────────────┘
                    //                   │
                    // ┌────────────────▼────────────────┐
                    // │ connectSocket(userData)         │
                    // │ ─────────────────────────────── │
                    // │  - if socket already connected, │
                    // │    return                       │
                    // │  - else create new socket       │
                    // │    io(backendUrl, {userId})     │
                    // │  - Listen for 'getOnlineUsers'  │
                    // │    and update setOnlineUsers    │
                    // └────────────────┬────────────────┘
                    //                  │
                    //        App is now authenticated
                    //        and real-time ready 🔄




// ---------------------------------------------------------------------- 
// ------------------------------------------------------------------------ 
                    // 🔐 Login Flow (login()) 

                    // User fills login form and clicks submit
                    //                 │
                    //                 ▼
                    // ┌────────────────────────────────────────┐
                    // │ login(state, credentials)              │
                    // │ ─────────────────────────────────────  │
                    // │ POST /api/auth/login or /register      │
                    // │ If success:                            │
                    // │   - setAuthUser(data.userData)         │
                    // │   - connectSocket(data.userData)       │
                    // │   - Save token to:                     │
                    // │       - axios default headers          │
                    // │       - localStorage                   │
                    // │       - setToken()                     │
                    // │   - toast.success                      │
                    // │   - toast.success                      │
                    // └────────────────────────────────────────┘


// ---------------------------------------------------------------------- 
// ------------------------------------------------------------------------ 

                    // Logout Flow 


                    // User clicks "Logout" button
                    //             │
                    //             ▼
                    // ┌────────────────────────────────────┐
                    // │ logout()                           │
                    // │ ─────────────────────────────────  │
                    // │ - Remove token from localStorage   │
                    // │ - Clear authUser, token, users     │
                    // │ - axios.headers.token = null       │
                    // │ - socket.disconnect()              │
                    // │ - toast.success('Logged out')      │
                    // └────────────────────────────────────┘



// ---------------------------------------------------------------------- 
// ------------------------------------------------------------------------                     
                    // Profile Update (updateProfile())


                    // User edits profile and submits
                    //             │
                    //             ▼
                    // ┌─────────────────────────────────────────────┐
                    // │ updateProfile(body)                         │
                    // │ ─────────────────────────────────────────── │
                    // │ PUT /api/auth/update-profile                │
                    // │ If success:                                 │
                    // │   - Update authUser with new profile data   │
                    // │   - Show success toast                      │
                    // └─────────────────────────────────────────────┘

// ---------------------------------------------------------------------- 
// ------------------------------------------------------------------------  
                    // Real-Time Socket Update Flow

                    // Socket connects ➡ Server emits: 'getOnlineUsers'

                    //                 │
                    //                 ▼
                    //     setOnlineUsers(userIds)
        
                    // This keeps the onlineUser state updated in real time, which can be used to show who's online (e.g., in a chat app).


                    // 📦 Values Exposed via Context

                    // <AuthContext.Provider value={{
                    //     axios, authUser, onlineUser,
                    //     socket, login, logout, updateProfile
                    // }}></AuthContext.Provider>

//                     All components inside this context (like your App) can access:

//                      The logged-in user

//                      Online users

//                      Functions like login/logout

//                      The live socket

//                      Axios with token pre-set

