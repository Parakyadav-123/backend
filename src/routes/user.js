import { Router } from "express";
import { registeruser, loginuser, logoutuser ,  refreshacccesstoken} from "../controllers/user.js";
import { upload } from "../middlewares/multer.js";
import {verifyJWT} from "../middlewares/auth.js"
const router = Router()

router.route("/register").post(
    upload.fields ([
        {
            name:"avatar" ,
            maxCount :1

        },
        {
            name  : "coverimage" ,
            maxCount:1
        }
    ]), //use multer to upload file images
 registeruser)

 router.route("/login").post(loginuser)


 //secured routes

 router.route("/logout").post(verifyJWT(),logoutuser)
 router.route("/refresh-token").post(refreshacccesstoken)



export default router