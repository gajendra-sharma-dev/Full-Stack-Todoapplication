import mongoose,{Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema = new Schema(
    {
        name:{
            type:String,
            required:[true,"name is required"],
            unique:true,
            lowercase:true,
            trim:true,
            index:true  ///searching filed
        },
        email:{
            type:String,
            required:[true,"email is required"],
            unique:true,
             trim:true,
        },
        password:{
            type:String,
             required:true


        },

           refreshToken:{
            type:String
        },
    

},{timestamps:true}

)

userSchema.pre("save", async function(next){
    if(!this.isModified("password"))  return 
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.ispasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = function() {
 return  jwt.sign(
        {
            _id : this._id,
            name:this.name,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPRIY
        }
    )
}
 
userSchema.methods.generateRefreshToken  = function() {
    return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPRIY
        }
    )
}




export const User = mongoose.model("User",userSchema)