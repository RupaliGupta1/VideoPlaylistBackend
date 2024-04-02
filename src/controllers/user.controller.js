import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../model/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinaryFileupload.js"
import { ApiResponse } from "../utils/ApiResponse.js";


//4 param (err,req,res,next)

const registerUser=asyncHandler( async (req,res)=>{
  //get user details from frontend

  const {fullname,username,email,password} = req.body
  console.log("email: ",email);

  //validation - not empty
  if( 
    [fullname,email,username,password].some((field)=>
    field?.trim()==="")
  ){
    throw new ApiError(400,"full name is required")
  }

  //check if user already exists:check username or email
  const existedUser=User.findOne({
    $or: [{ username },{ email }]
   })

   if(existedUser)
   {
    throw new ApiError(409,"user with email or username already present")
   }


  //file is presemt or not-avatar,cover img
  const avatarLocalPath=req.files?.avatar[0]?.path
  const coverImageLocalPath=req.files?.coverImage[0]?.path

  if(!avatarLocalPath)
  {
   throw new ApiError(400,"Avatar file is required")
  }


  //upload them to cloudinary, and is avatar upload in cloudari or not
  const avatar= await uploadOnCloudinary(avatarLocalPath)
  await uploadOnCloudinary(coverImageLocalPath)

  if(!avatar)
  {
   throw new ApiError(400,"Avatar file is required")
  }

  //create usr obj - create entry in db
    
  const user=await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
   })

  //remove pass and refreshtoken field from response
  const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"
   )

  //check for user creation 
  if(!createdUser)
  {
   throw new ApiError(500,"something went wrong while registring user")
  }

  //return res
  return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered successfully")

   )

})

export {registerUser,}