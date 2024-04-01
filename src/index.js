//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()




/*  code for connting with atlas mongo db online , approch 1- write all in index.js
                             approch 2- write all in code in diff folder db and imp it here in index.js

import express from 'express'
const app=express()
;(async ()=>{
    try{
      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)

      application.on("error",(err)=>{
        console.error("Error: ",err)
        throw err   
       })

       app.listen(process.env.PORT,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
       })
    }catch(err){
        console.error("Error: ",err)
        throw err
    }
})()  //ifis it ll run when load

*/