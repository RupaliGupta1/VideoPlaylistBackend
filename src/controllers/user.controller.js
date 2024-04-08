import { asyncHandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../model/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinaryFileupload.js"
import { ApiResponse } from "../utils/ApiResponse.js";

//make method who can generate tokens here only bcz we ll use it mulitple time ..main code is in user model
const generateAccessAndRefreshTokens=async(userId)=>
{
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return {accessToken, refreshToken}


} catch (error) {
    throw new ApiError(500, "Something went wrong while generating referesh and access token")
}

}



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
  const existedUser=await User.findOne({
    $or: [{ username },{ email }]
   })

   if(existedUser)
   {
    throw new ApiError(409,"user with email or username already present")
   }


  //file is presemt or not-avatar,cover img

  console.log(req.files);
  const avatarLocalPath=req.files?.avatar[0]?.path
  // const coverImageLocalPath=req.files?.coverImage[0]?.path

  if(!avatarLocalPath)
  {
   throw new ApiError(400,"Avatar file is required")
  }


  let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) 
  {
    coverImageLocalPath = req.files.coverImage[0].path
  } 



  //upload them to cloudinary, and is avatar upload in cloudari or not
  const avatar= await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverImageLocalPath)

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


//****************************login user*********************************** */

const loginUser = asyncHandler(async (req, res) =>{
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and referesh token
  //send cookie

  const {email, username, password} = req.body
  console.log(email);

  if (!username && !email) {
      throw new ApiError(400, "username or email is required")
  }
  
  // Here is an alternative of above code based on logic discussed in video:
  // if (!(username || email)) {
  //     throw new ApiError(400, "username or email is required")
      
  // }

  const user = await User.findOne({
      $or: [{username}, {email}]
  })

  if (!user) {
      throw new ApiError(404, "User does not exist")
  }

 const isPasswordValid = await user.isPasswordCorrect(password)
 console.log(isPasswordValid)

 if (!isPasswordValid) {
  throw new ApiError(401, "Invalid user credentials")
  }

 const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

  const options = {
      httpOnly: true,
      secure: true
  }

  return res
  .status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(
      new ApiResponse(
          200, 
          {
              user: loggedInUser, accessToken, refreshToken
          },
          "User logged In Successfully"
      )
  )

})



const logoutUser=asyncHandler(async(req,res)=>{
    //we will design our middleware to get logged in usr info that is authmiddleware
  await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined
        }
      },{
        new:true
      }
    )

    const options={ //with this cookies cn be modified only from server not fron frontnd
      httpOnly:true,
      secure:true
     }

     return res.status(200)
     .clearCookie("accessToken",accessToken,options)
     .clearCookie("refreshToken",refreshToken,options)
     .json(new ApiResponse(200,{},"User logged out"))

})
export {
  registerUser,
  loginUser,
logoutUser
}