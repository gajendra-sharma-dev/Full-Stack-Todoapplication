import {asynchandler} from "../utils/asynchandler.js"
import {ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/users.models.js"



export const verfiyJWT = asynchandler(async(req,res,next)=>{
    try {

        const token = req.cookies?.AccessToken || req.header("authorization")?.replace("Bearer ","")

         if(!token) {
            throw new ApiError(400,"Unauthorization request")
         }

         const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

         const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
        
              if(!user) {
                throw new ApiError(400,"user not find access token not vaild")
              }

              req.user = user
              next()
             
        
    } catch (error) {
          throw new ApiError(401,error?.message || "Invaild access token")
        
    }
})