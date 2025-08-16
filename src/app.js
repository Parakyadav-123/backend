import express from "express"
import cors from "cors"
import cookierParser from "cookie-parser"
// import  {userroouter} from "./routes/user.js"
// ✅ CORRECT (default import)
import userRouter from "./routes/user.js";


const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN ,
    credentials : true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended :true , limit :"16kb"}))
app.use(express.static("public"))
app.use(cookierParser())



// app.use("/users", userroouter)
app.use("/api/users", userRouter);

// http://localhost:3000/users/register


// app.use("/api/v1/users", userroouter)
// http://localhost:3000/api/v1/users/register


export{app}