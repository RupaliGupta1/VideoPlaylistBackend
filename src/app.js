import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
})) //allowing cors 

app.use(express.json({limit:"16kb"}))//when data come in json body
app.use(express.urlencoded({extended:true,limit:"16kb"}))//when url is not proper ie it has some encode values
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from './routes/user.routes.js'





//routes declaration --starring api point
app.use("/api/v1/users", userRouter);
export { app } 

//http://localhost:8000/api/v1/users/register