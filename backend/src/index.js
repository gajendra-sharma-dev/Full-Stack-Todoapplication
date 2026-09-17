import dotenv from "dotenv"
import connectDB from "./db/db.js"
import { app } from "./app.js"
dotenv.config({
    path:"./.env"
})
const port = process.env.PORT || 3000

connectDB().then(()=>{
   app.listen(port,()=>{
    console.log(`app is listning on ${port}`);
    
   })
}).catch((Error)=>{
    console.log(`mongodb connection filed,${Error}`);
    
})



