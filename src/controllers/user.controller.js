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

    const existedUser = await User.findOne({
        $or:
            [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User whith email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log(req.files)
    // console.log(avatarLocalPath)
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is reqired")
    }
    const avatar = await uplodeOnClodinary(avatarLocalPath)
    const coverImage = await uplodeOnClodinary(coverImageLocalPath)
    // console.log("avatar ", avatar);

    if (!avatar) {
        throw new ApiError(400, "Avatar image not nirmal papa  found")
    }
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // console.log("full name is ", user.fullName)
    // console.log("full name is ", user.password)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiResponse(
            201,
            createdUser,
            "User registered successfully"
        )
    );

})

export { registerUser }