import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../model/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinaryFileupload.js"
import { ApiResponse } from "../utils/ApiResponse.js";
//4 param (err,req,res,next)
const registerUser=asyncHandler( async (req,res)=>{
  //get user details from frontend
  //validation - not empty
  //check if user already exists:check username or email
  //file is presemt or not-avatar,cover img
  //upload them to cloudinary, and is avatar upload in cloudari or not
  //create usr obj - create entry in db
  //remove pass and refreshtoken field from response
  //check for user creation 
  //return res

  const {fullname,username,email,password} = req.body
  console.log("email: ",email);

  if(   //validation
    [fullname,email,username,password].some((field)=>
    field?.trim()==="")
  ){
    throw new ApiError(400,"full name is required")
  }

  const existedUser=User.findOne({
    $or: [{ username },{ email }]
   })

   if(existedUser)
   {
    throw new ApiError(409,"user with email or username already present")
   }

   const avatarLocalPath=req.files?.avatar[0]?.path
   const coverImageLocalPath=req.files?.coverImage[0]?.path

   if(!avatarLocalPath)
   {
    throw new ApiError(400,"Avatar file is required")
   }


   const avatar= await uploadOnCloudinary(avatarLocalPath)
   await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar)
   {
    throw new ApiError(400,"Avatar file is required")
   }

   const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })

   const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser)
   {
    throw new ApiError(500,"something went wrong while registring user")
   }

   return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")
   )

})

export {registerUser,}