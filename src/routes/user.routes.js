import { Router } from "express";
import {
    loginUser, registerUser, logoutUser, refreshAccessToken, getCurrentUser, changeCurrentPassword,
    updateAccountDetails, updateUserAvatar, updateUserCoverImage,
    getUserChanelProfile, getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/get-user").get(verifyJWT, getCurrentUser)
router.route("/change-current-Password").patch(verifyJWT, changeCurrentPassword)
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)
router.route("/update-user-avatar").patch(verifyJWT, upload.single("avatarLocalPath"), updateUserAvatar)
router.route("/update-user-cover-image").patch(verifyJWT, upload.single("imageLocalPath"), updateUserCoverImage)
router.route("/c/:username").get(verifyJWT, getUserChanelProfile)
router.route("/watch-history").get(verifyJWT, getWatchHistory)


export default router