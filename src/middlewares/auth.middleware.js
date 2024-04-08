import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asynchandler.js";
import { User } from "../model/user.model.js";
//alwys use next for middleware
                                            //here there is no need of res so we cn use _ instead of res
export const verifyJWT=asyncHandler(async (req,res,
    next)=>{
   try {
    const token= req.cookie?.accessToken || 
    req.header("Authorization")?.replace("Bearer ","")
 
    if(!token)
    {
     new ApiError(401,"Unauthorized Request")
    }
    
    const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
    const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if(!user)
    {
     throw new ApiError(401,"Invalid Access Token")
    }
 
    req.user=user;
    next()
 
 
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid access token")
   }

})