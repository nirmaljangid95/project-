import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uplodeOnClodinary } from "../utils/fileUplode.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { json } from "express";

const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message:"ok"
    // })
    const { fullName, email, username, password } = req.body
    //    if(fullName === ""){        // if i want to chack every field one by one the write this code
    //     throw new ApiError(400,"fullname is required")
    //    }

    if (
        [fullName, email, username, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required ")
    }

    const existedUser = User.findOne({
        $or:
            [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User whith email or username already exists")
    }
    const avatarLocalPath = res.files?.avatar[0]?.path;
    const coverImageLocalPath = res.files?.coverImage[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is rewired")
    }
    const avatar = await uplodeOnClodinary(avatarLocalPath)
    const coverImage = await uplodeOnClodinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar image not found")
    }
   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage : coverImage?.url || "",
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

    return res.status(201,json(
        new ApiResponse(200,createdUser,"User register successfully")
    ))

})

export { registerUser }