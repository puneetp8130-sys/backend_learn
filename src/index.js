// required('dotenv').config({path: './env'})
import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path : "./env"
})


connectDB()
.then(() => {
    try {
        app.listen(process.env.PORT || 8000, () => {
        console.log(` Server is running at port : ${process.env.PORT}`);
    });
    } catch (error){
        console.log("Server start failed:",error);
    }
})
.catch((err) =>{
    console.log("MONGO db connection failed !!! ",err);
});










// import express from "express"
// const app = express()

// ;(async () => {
//     try{
//        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//        app.on("error", (error) => {
//         console.log("ERROR: ",error);
//         throw error
//        })

//        app.listen(process.env.PORT,() => {
//         console.log(`App is listeing on ${process.env.PORT}`)
//        });
//     }catch (error){
//         console.error("ERROR: ",error)
//         throw err
//     }
// })