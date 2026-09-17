import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

import validator from "validator"
import {User} from "../models/users.models.js"


const genreteAccesAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
         const AccessToken = user.generateAccessToken()
         const refreshToken = user.generateRefreshToken()
    
         user. refreshToken = refreshToken
         await user.save({validateBeforeSave:false})
    
         return {AccessToken,refreshToken}
    } catch (error) {
         console.log("error while genrated access and refresh token",error);
    throw new ApiError(500,"Something went wrong while genrated access and refresh token")
        
    }
}


const registerUser = asynchandler(async(req,res)=>{
    const {name,email,password} = req.body
    if([name,email,password].some((field)=>(field?.trim() === ""))) {
        throw new ApiError(400, "All fields are required")
    }

    if(!validator.isEmail(email)) {
        throw new ApiError(400,"email could be correct from")
    }

   const exitingUser = await User.findOne({$or:[{name},{email}]})  //User.findOne({$or:[{username},{email}]}) 

     if(exitingUser) {
        throw new ApiError(400,"name and email is Already exit")
     }

   const user =  await User.create(
        {
            name,
            email,
            password
        }
     )

  const createuser =  await User.findById(user._id).select("-password -refreshToken")

    if(!createuser) {
        throw new ApiError(400,"something went wrong while regetring the user")
    }
    return res.status(200).
    json(new ApiResponse(200,createuser,"user successfully register"))
})


const loginUser = asynchandler(async(req,res)=>{
    const {name,email,password} = req.body


    if(!name) {
        throw new ApiError(400,"name is required")
    }
    if(!email) {
        throw new ApiError(400,"email is required")
    }

    if(!password) {
        throw new ApiError(400,"password is required")
    }

    const user = await User.findOne({$or:[{name},{email}]})

    if(!user) {
        throw ApiError(400,"user not find")
    }

    const ispasswordvaild =   await user.ispasswordCorrect(password)
    if(!ispasswordvaild) {
        throw new ApiError(400,"password is incorrect try again")
    }

    const {AccessToken,refreshToken} = await genreteAccesAndRefreshToken(user._id)

    const loginuser =  await User.findById(user._id).select("-password -refreshToken")


    const options ={
  httpOnly:true,
  secure:true,

 }

  return res.status(200).
  cookie("AccessToken",AccessToken,options).
  cookie("refreshToken",refreshToken,options).
  json(new ApiResponse(200, {
      user:loginuser,refreshToken,AccessToken
    },"login successfully"))
})


const logoutUser = asynchandler(async(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$unset:{
        refreshToken:1
    }
},
{
    new:true
}
)

const options ={
  httpOnly:true,
  secure:true,

 }
 return res.
 status(200).
 clearCookie("AccessToken",options).
 clearCookie("refreshToken",options).
 json(
  new ApiResponse(200,{},"User successfully logout")
 )

})


const updatePassword = asynchandler(async(req,res)=>{
    const {oldpassword,newpassword} = req.body

    if(!(oldpassword && newpassword)) {
        throw new ApiError(400,"oldpassword and newpassword is required")
    }

  const user  =  await User.findById(req.user?._id)

  const passwordisVaild = await user.ispasswordCorrect(oldpassword)

  if(!passwordisVaild) {
    throw new ApiError(400,"old password is wrong")
  }

  user.password = newpassword

  await user.save({validateBeforeSave:false})

  return res.status(200).
  json(new ApiResponse(200,"password successfully change"))
})

const getcurrentUser = asynchandler(async(req,res)=>{
    return res.status(200).
    json(new ApiResponse(200,req.user,"current user fetch successfully"))

})


const updateDetail = asynchandler(async(req,res) =>{
    const {name,email} = req.body
    if(!name || !email) {
        throw new ApiError(400,"all filed is required")
    }

  const user = await  User.findByIdAndUpdate(req.user?._id,{$set:{
        name,
        email
    }},
    {
        new:true
    }
)
 return res.
     status(200).
     json(new ApiResponse(200,user,"All filed are successfully updated"))
})

 const refreshAccesstoken = asynchandler(async (req,res) => {
  const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken


     if(!incomingRefreshToken) {  
      throw new ApiError(410,"unauthorization request")
     }

   try {
    const decodedToken =  jwt.verify(
       incomingRefreshToken,
       process.env.REFRESH_TOKEN_SECRET
      )
 
   const user =  await User.findById(decodedToken?._id)
 
      if(!user) { 
       throw new ApiError(410,"Invaild refresh token")
      }
   
 
       if(incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(410,"Refresh token is expired or used")
       }
 
       
 const options ={
   httpOnly:true,
   secure:true,
 
  }
 
      const {AccessToken,newrefreshToken} = await genreteAccesAndRefreshToken(user._id)
 
        return res
        .status(200)
        .cookie("AccessToken",AccessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
         new ApiResponse(200,{AccessToken,refreshToken:newrefreshToken},"access token refersh successfully")
        )
   } catch (error) {
    throw new ApiError(401,error?.massage || "Invaild refresh token")
    
   }
 })


export {registerUser,loginUser,updatePassword,getcurrentUser,updateDetail,refreshAccesstoken,logoutUser}