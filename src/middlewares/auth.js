import { asynchandler } from "../utils/asyncHandler.js";
import { apierror } from "../utils/apierror.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accesstoken ||
      req.header("Authorization")?.replace("Bearer", "").trim();

    if (!token) {
      throw new apierror(401, "unauthorized req");
    }

    const decodetoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodetoken?._id).select(
      "-password -refreshtoken"
    );

    if (!user) {
      throw new apierror(401, "invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new apierror(401, error?.message || "invalid access token");
  }
});










// import { asynchandler } from "../utils/asyncHandler";

// import {apierror} from "../utils/apierror"
// import jwt from "jsonwebtoken"
// import {User} from "../models/user.js"

// try {
//     export const  verifyJWT = asynchandler(async(req , res ,next)=>{
//         const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer", "")
//         if(!token){
//             throw new apierror(401, "unauthorized req")
//         }
    
//          const decodetoken =jwt.verify(token ,process.env.ACCESS_TOKEN_SECRET)
//         const user = await User.findById(decodetoken?._id).select("-password -refreshtoken")
    
//         if(!user){
//             throw  new apierror(401 ,"invalid access token")
//         }
    
    
//         req.user =user
//         next()
// } catch (error) {
//     throw new apierror(401 , error?.message || "invalid access token")
    
// }
// })





