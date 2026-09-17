import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import { Todo } from "../models/todos.models.js";
import {Todolist} from "../models/todolist.models.js"
import mongoose from "mongoose"


const createTodo = asynchandler(async(req,res)=>{
  const {todolistId} = req.params
  const {description,title,Status,priority,dueAt}  = req.body

    if(!mongoose.isValidObjectId(todolistId)) {
        throw new ApiError(400,"todo list id is not vaild")
    }
     const list =  await Todolist.findById(todolistId)

      if(!list) {
        throw new ApiError(400,"Todo list does not exit")
      }

      if(!title || title?.trim() == "") {
        throw ApiError(400,"title is required")
      }

   const Todos =  await Todo.create(
        {
            title,
            description,
            Status,
             priority,
             dueAt,
             owner:req.user?._id,
             list:todolistId

        }
      )
      return res.status(200).
      json(new ApiResponse(200,Todos,"todo successfully create"))
})

const getTodoByTodolist = asynchandler(async(req,res)=>{
    const {todolistId} = req.params

    if(!mongoose.isValidObjectId(todolistId)) {
        throw new ApiError(400,"todo list is not vaild")
    }

  const todo =  await Todo.find({list:todolistId})

  if(!Todo) {
    throw new ApiError(400,"todo list not found")
 
  }

   return res.status(200).
  json(new ApiResponse(200,todo,"todo is get by todolist"))
})

const getTodoId = asynchandler(async(req,res)=>{
    const {todoId} = req.params

    if(!mongoose.isValidObjectId(todoId)) {
        throw ApiError(400,"todo id is not vaild")
    }

  const todo =  await Todo.findById(todoId)
  
    if(!todo) {
        throw ApiError(400,"todo is not found")
    }

    return res.status(200).
    json(new ApiResponse(200,todo,"todo fetch successfully"))
})

const updateTodo = asynchandler(async(req,res)=>{
    const {todoId} = req.params
 const {description,title,Status,priority,dueAt}  = req.body

    if(!mongoose.isValidObjectId(todoId)){
        throw new ApiError(400,"todo id is not vaild")
    }

   const todo  = await Todo.findById(todoId) 

      if(!todo) {
        throw new ApiError(400,"todo not find")
      }
  
      if(todo.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"you not allow to update this todo")
      }
        
      const updateFiled = {}
      if(title?.trim()) updateFiled.title = title
       if(description?.trim()) updateFiled.description = description
       if(Status?.trim())  updateFiled.Status = Status
       if(priority?.trim())  updateFiled.priority = priority
       if(dueAt?.trim())  updateFiled.dueAt = dueAt
    
      if(Status === "completed"){
        updateFiled.completedAt = new Date()
      }
        const updateTodos = await Todo.findByIdAndUpdate(todoId,{$set:updateFiled},{new : true})

         return res.status(200).
         json(new ApiResponse(200,updateTodos,"Todo update successfully"))
        
})

const deleteTodo = asynchandler(async(req,res)=>{
    const {todoId} = req.params

     if(!mongoose.isValidObjectId(todoId)){
        throw new ApiError(400,"todo id is not vaild")
    }
 const todo  = await Todo.findById(todoId) 

      if(!todo) {
        throw new ApiError(400,"todo not find")
      }

       if(todo.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(400,"you not allow to delete this todo")
      }
        await Todo.findByIdAndDelete(todoId)
  return res.status(200).
   json(new ApiResponse(200,{},"Todo successfully deleted"))
})
 

export  {getTodoByTodolist,getTodoId,updateTodo,deleteTodo,createTodo}