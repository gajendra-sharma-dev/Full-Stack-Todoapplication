import {Router} from "express"
import {getTodoByTodolist,getTodoId,updateTodo,deleteTodo,createTodo} from "../controllers/todo.controllers.js"
import {verfiyJWT}  from "../middleware/auth.middleware.js"


const router = Router()
router.use(verfiyJWT)

router.route("/gettodo/:todoId").get(getTodoId)
router.route("/updateTodo/:todoId").patch(updateTodo)
router.route("/deleteTodo/:todoId").delete(deleteTodo)
router.route("/getTodoByTodolist/:todolistId").get(getTodoByTodolist)
router.route("/createTodo/:todolistId").post(createTodo)





export default router
