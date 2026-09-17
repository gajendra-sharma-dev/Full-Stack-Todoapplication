import { Router } from "express";

import {registerUser,loginUser,updatePassword,getcurrentUser,updateDetail,refreshAccesstoken,logoutUser}  from "../controllers/user.controllers.js"
import {verfiyJWT}  from "../middleware/auth.middleware.js"

const router = Router()


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verfiyJWT,logoutUser)
router.route("/update").patch(verfiyJWT,updateDetail)
router.route("/currentUser").get(verfiyJWT,getcurrentUser)
router.route("/refreshToken").patch(verfiyJWT,refreshAccesstoken)
router.route("/updatepassword").post(verfiyJWT,updatePassword)



export default router