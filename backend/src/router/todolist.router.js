import {Router} from "express"
import {createTodoList,getAlluserlist,getTodoListById,updateTodolist,deleteTodolist} from "../controllers/todolist.controllers.js"
import {verfiyJWT}  from "../middleware/auth.middleware.js"



const router = Router()

router.use(verfiyJWT)

router.route("/createTodolist").post(createTodoList)
router.route("/getUserlist/:userId").get(getAlluserlist)
router.route("/getlistById/:todoListId").get(getTodoListById)
router.route("/updatetodoList/:todoListId").patch(updateTodolist)
router.route("/deletetodoList/:todoListId").delete(deleteTodolist)



export default router