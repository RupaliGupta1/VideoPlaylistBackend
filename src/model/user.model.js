import mongoose,{Schema} from "mongoose";
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

//if pass updation is not so we dont need to again bcrypt our pass
    userSchema.pre("save", async function(next){//here next is working as middleware
        if(!this.isModified("password")) return next();
       
        this.password=await bcrypt.hash(this.password, 10)//if upd so take tht pass and ecrypt and save in db
        next()
    })
//to compare pass during authentication
    userSchema.methods.isPasswordCorrect  = async function 
    (password) {
        console.log(password,this.password);
      const isMatch= await bcrypt.compare(password,this.password);
      return isMatch
    }


    userSchema.methods.generateAccessToken = function(){
    }
    userSchema.methods.generateRefreshToken = function(){
    }


export const User=mongoose.model("User",userSchema)


//datamodel
//https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj