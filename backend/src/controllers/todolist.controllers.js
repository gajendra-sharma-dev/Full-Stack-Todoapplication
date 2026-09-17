import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import {Todolist} from "../models/todolist.models.js"
import mongoose from "mongoose";


const createTodoList = asynchandler(async(req,res)=>{
    const {name,description} = req.body

     if(!name || name?.trim() == "") {
        throw new ApiError(400,"name is required")
     }

 const todolist = await Todolist.create({
        name,
        description,
        owner:req.user?._id
     })
     return res.status(200).
     json(new ApiResponse(200,todolist,"Todo list is create successfully"))
})


const getTodoListById  =  asynchandler(async(req,res)=>{
    const {todoListId} = req.params

    if(!mongoose.isValidObjectId(todoListId)){
        throw new ApiError(400,"todo list id is not correct from")
    }

    const Todolists =  await Todolist.findById(todoListId)

     if(!Todolists) {
        throw new ApiError(400,"Todo list not find")
     }

     return res.status(200).
     json(new ApiResponse(200,Todolists,"Todo list fetch successfully"))
})


const getAlluserlist = asynchandler(async(req,res)=>{
    const {userId} = req.params

    if(!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400,"To fetch all todolist of user so put correct userId")
    }

  const listOfTodos =  await Todolist.find({owner:userId})

   if(!listOfTodos) {
    throw new ApiError(400,"user can not be hold any list of todo")
   }
   return res.status(200).
   json(new ApiResponse(200,listOfTodos,"successfully find users todolist"))
})


const updateTodolist = asynchandler(async(req,res)=>{
    const {todoListId} = req.params
    const {name,description} = req.body

    if(!mongoose.isValidObjectId(todoListId)) {
        throw new ApiError(400,"you can update only when you send correct todo id")
    }

    if(!name || name.trim() == ""){
        throw new ApiError(400,"name is required")
    }

  const todolist =  await Todolist.findById(todoListId)

  if(!todolist) {
    throw new ApiError(400,"todo not found")
  }

    if(todolist.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(400,"you are not allow to update this todo")
    }

    const upadteFiled = {}
    if(name?.trim()) upadteFiled.name = name
    if(description?.trim()) upadteFiled.description = description



 const updatetodoslist =  await Todolist.findByIdAndUpdate(todoListId,{$set:upadteFiled},{new:true})

      return  res.status(200).
      json(new ApiResponse(200,updatetodoslist,"todo list successfully updated"))
})

const  deleteTodolist = asynchandler(async(req,res)=>{
    const {todoListId} = req.params

    if(!mongoose.isValidObjectId(todoListId)){
        throw new ApiError(400,"for delete todo list id is not vaild")
    }

 const todos =   await Todolist.findById(todoListId)
   if(!todos) {
    throw new ApiError(400,"todo you want does not exit")
   }

   const todolist =  await Todolist.findById(todoListId)

  if(!todolist) {
    throw new ApiError(400,"todo not found")
  }


   if(todolist.owner.toString() !== req.user?._id.toString()){
    throw new ApiError(400,"you are not allow to delete this todo")
   }
     await Todolist.findByIdAndDelete(todoListId)

     return res.status(200).
     json(new ApiResponse(200,"todo delete successfully"))
})


export {createTodoList,getAlluserlist,getTodoListById,updateTodolist,deleteTodolist}