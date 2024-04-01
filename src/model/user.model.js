import mongoose,{Schema} from "mongoose";
import { Jwt } from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema=new Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,//cloudinary url
            required:true,
        },
        coverImage:{
            type:String,//cloudinary url
        },
        watchHistory:[
            {
               type:Schema.Types.ObjectId,
               ref:"Video" 
            }
        ],
        password:{
            type:String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String
        }

    },
    {
        timestamps:true //it store createdat and updatedat value
    }
    )


    userSchema.pre("save", async function(next){
        if(!this.isModified("password")) return next();//if pass updation is not so we dont need to again bcrypt our pass
       
        this.password=bcrypt.hash(this.password, 10)//if upd so take tht pass and ecrypt and save in db
        next()
    })

    userSchema.methods.isPasswordCorrect  = async function 
    (password) {
       await bcrypt.compare(password,this.password)
    }


    userSchema.methods.generateAccessToken=function(){
       return jwt.sign(
            {
                _id: this._id,
                email:this.email,
                username:this.username,
                fullname:this.fullname
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    }
    userSchema.methods.generateRefreshToken=function(){
        return jwt.sign(
            {
                _id: this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    }



export const User=mongoose.model("User",userSchema)


//datamodel
//https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj