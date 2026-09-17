import mongoose,{Schema} from "mongoose"


const todolistSchema = new Schema(
    {
        name:{
            type:String,
            required:[true,"name is required"],
          
        },
        description:{
            type:String,
            required:[true,"email is required"],
           
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
       

},{timestamps:true}

)


export const Todolist = mongoose.model("Todolist",todolistSchema)