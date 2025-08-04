import jwt from 'jsonwebtoken'

// Funtion to create token for user 
export const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET);
    return token ;
}


