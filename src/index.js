// require('dotenv').config({path: './env'})
import dotenv  from "dotenv"
// import mongoose from  "mongoose"
// import { DB_NAME } from "./constants";
import connectDB from "./db/index.js";
import { app  } from "./app.js";

dotenv.config({
    path : './.env'
})
console.log(process.env.MONGODB_URI);
connectDB()
.then(() => {
    app.listen (process.env.PORT || 8000 , ()=>{
        console.log(`SERVER IS RUNNING AT PORT : ${process.env.PORT}`);
        
    })
})

.catch((err) =>{
    console.log("mongo db connection failed" , err);
    
})


// import dotenv from "dotenv";
// dotenv.config({ path: "./env" });    // or remove path if using default '.env'
// console.log("🔐 MONGODB_URI =", process.env.MONGODB_URI);
// import connectDB from "./db/index.js";
// connectDB();






















// import express from "express"
// const app = express()
// //ifee 
// ( async()=> {
//     try {
// awaitmongoose.connect(`${process.env.MONGODB_URI}/{DB_NAME}`)
// app.on("error", (error)=> {
//     console.log("error: " , error);
//     throw error
    

// })

// app.listen(process.env.PORT , () => {
//     console.log(`app is lestening on port ${process.env.PORT}`);
    
// })
//     }
//     catch(error){
//         console.error("ERROR:" error);
//         throw err
        
//     }

// })()