import mongoose from 'mongoose';
const connectDb = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Mongodb Connected: ${connect.connection.host}`)
    } catch (error) {
        console.log("Error in mongodb : ",error.message)
    }
}


export default connectDb