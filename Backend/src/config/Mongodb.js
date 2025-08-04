import mongoose from 'mongoose'

export const ConnectDb = async ()=>{
    try {
        mongoose.connection.on('Connected',()=>{console.log('Database connected')});
        await mongoose.connect(`${process.env.MONGODB_URI}/chatapp`)
    } catch (error) {
        console.log(error);
    }
}

