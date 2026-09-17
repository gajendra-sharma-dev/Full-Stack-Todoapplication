import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()



app.use(cors({
    origin:process.env.CROSS_ORIGIN,
     credentials: true 
}))


app.use(express.json({limit:"16kb"}))  // req.body se data max size  16kb. data json me hoga jo frontent se aayaga
app.use(express.urlencoded({extended:true,limit:"16kb"}))  //yaha data html ke rup me aata hai usko samhe ke liye.
app.use(express.static("public"))


app.use(cookieParser())


import registerRoter from "./router/user.router.js"
import todolistRouter from "./router/todolist.router.js"
import todoRouter from "./router/todo.router.js"

app.use("/api/v1/users",registerRoter)
app.use("/api/v1/todos",todolistRouter)
app.use("/api/v1/todo",todoRouter)

export {app}
