import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asynHandler } from "../utils/asynHandler";
import jwt from "jsonwebtoken"

export const verifyJWT = asynHandler(async(req,res,next) =>{
    try {
        const token = req.cookies?.acessToken || req.header("Authorization")?.replace("Bearer","")
    
        if(!token){
            throw new ApiError(401,"Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,proccess.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
    
        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})