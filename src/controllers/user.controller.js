import { asynHandler } from '../utils/asynHandler.js'
import { ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnClouninary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'


const registerUser = asynHandler(async (req,res) => {
    
    const { fullname, email, username, password} = req.body
    console.log("email: ",email);

    if(
        [fullname,email,username,password].some((field) =>
        field?.trim() === "")
    ){
        throw new ApiError(400,"All field are required")
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!regex.test(email)){
        throw new ApiError(400,"Email is Invalid!");
    }

    const existedUser = User.findOne({
    $or:[{ email }, { username }]
    })

    if(existedUser){
        throw new ApiError(409, "User with Email or Username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    console.log("avatar path:" ,avatarLocalPath)

    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required");
    }

    const avatar = await uploadOnClouninary(avatarLocalPath)
    const coverImage = await uploadOnClouninary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

})

  

export {
    registerUser,
}