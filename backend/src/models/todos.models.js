import mongoose,{Schema} from "mongoose"
const todoSchema = new Schema(
    {
       
        description:{
            type:String,
            required:[true,"description is required"],
           
        },
         title:{
            type:String,
            required:[true,"title is required"],
           
        },
         Status:{
            type:String,
            required:true
           
        },
         priority:{
            type:String,
            required:true
           
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        list:{
       type:Schema.Types.ObjectId,
       ref:"Todolist"

        },
        dueAt:{
            type:Date,
            default:null
        },
        completedAt:{
            type:Date,
            default:null
        }
       

},{timestamps:true}

)


export const Todo = mongoose.model("Todo",todoSchema)