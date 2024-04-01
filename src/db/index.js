import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";



const connectDB=async ()=>{
    try{
       const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`)
    }
    catch(err){
        console.log("Mongodb connection err ",err)
        process.exit(1)
    }
}

export default connectDB