// require('dotenv').config()
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./aap.js";
dotenv.config({
    path: './env'
})
const port = process.env.PORT | 8000
connectDB()
.then(()=>{
   app.listen(port,()=>{
       console.log(`server is running at port : $ {process.env.PORT}`);
   })
})
.catch ((err)=>{
    console.log(`MONGO db connection failedd : ${err}`)
})







// ( async() => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//     } catch (error){
//         console.error("ERRoR : ",error)
//     }
// })()
