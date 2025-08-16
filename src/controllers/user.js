// import {asynchandler} from "../utils/asyncHandler.js" ;
// import {apierror} from "../utils/apierror.js"
// import User from "../models/user.js"
// import {uploadcloudinary} from "../utils/cloudinary.js"
// import {apiresponse} from "../utils/apiresponse.js"
// const registeruser = asynchandler(async (req ,res) => {
//     // res.status(200).json({
//     //     messahe : "ok"
//     // })


//     //get user detail from frontmen //check yor model

//     //validation-not empty
//     //check if usser exit : user neme and email
//     //check for images and avtar
//     //upload them to cloudinary avatar 
//     //create user object -- create entry in db
//     //remove password and refresh token feild from response
//     //check for user creation
//     //return res
//     console.log("Incoming files:", req.files);


//      const {fullname , email, username,password }= req.body
//      console.log("email" , email);

//     //  if (fullname === ""){
//     //     throw new apierror(400 , "fullname is req")
//     //  }  //check on efeild
    
//     if (
//          [fullname , email, username , password].some((field)=> field?.trim()==="")
//     ) {
// throw new apierror(400 , "all field are req")
//     }

//    const existeduser= await User.findOne({
//         $or : [{username} ,{email} ]
//     })
//     if(existeduser){
//         throw new apierror(409 ,"user already existed")
//     }
//    //  const avatarlocalpath= req.files?.avatar[0]?.path
//    const avatarlocalpath = req.files?.avatar?.[0]?.path;

//     console.log(req.files);
    
//    //  const coverimagelocalpath = req.files?.coverimage[0]?.path
//    const coverimagelocalpath = req.files?.coverimage?.[0]?.path;
//     console.log("req.files:", req.files);
// console.log("avatar path:", req.files?.avatar?.[0]?.path);
// console.log("coverimage path:", req.files?.coverimage?.[0]?.path);

//      if (!avatarlocalpath){
//         throw new  apierror (400 , "avatar file is rq")
//      }

//      const avatar=  await uploadcloudinary(avatarlocalpath)
//      const coverimage=  await uploadcloudinary(coverimagelocalpath)

//      if(!avatar){
//         throw new apierror(400 , "avatar field are req")

//      }

//     const user = await User.create({
//         fullname ,
//         avatar:avatar.url,
//         coverimage : coverimage?.url || "",
//         email ,
//         password,
//         username : username.toLowerCase()


//      })

//      const createduser = await User.find(user._id).select (
//         "-password -refreshtoken"
//      )
//      if(!createduser){
//         throw new apierror( 500  , "somthing went wrong")
//      }

//      return res.status(201).json(
//         new apiresponse(200, createduser, "user registed success" )
//      )
// })

// export{registeruser}

import { asynchandler } from "../utils/asyncHandler.js";
import { apierror } from "../utils/apierror.js";
import User from "../models/user.js";
import { uploadcloudinary } from "../utils/cloudinary.js";
import { apiresponse } from "../utils/apiresponse.js";
import jwt from "jsonwebtoken"


const generateaccessandrefereshtoken = async(userId)=>{
  try {
    const user = await User.findById(userId)
    const accesstoken =user.generateaccesstoken()

    const refereshtoken =user.generaterefreshtoken()
    user.refreshtoken =refereshtoken
    await user.save({validateBeforSave:false})
    return{accesstoken , refereshtoken}

  } catch (error) {
    throw new apierror (500 , "something went wrong access and referesh token")
    
  }
}

const registeruser = asynchandler(async (req, res) => {
  console.log("Incoming files:", req.files);

  const { fullname, email, username, password } = req.body;
  console.log("Email:", email);

  // Validate required text fields
  if ([fullname, email, username, password].some((field) => !field || field.trim() === "")) {
    throw new apierror(400, "All fields are required");
  }

  // Check if user exists by username or email
  const existeduser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existeduser) {
    throw new apierror(409, "User already exists");
  }

  // Extract uploaded file paths safely
  const avatarlocalpath = req.files?.avatar?.[0]?.path;
  const coverimagelocalpath = req.files?.coverimage?.[0]?.path;

  console.log("Avatar file path:", avatarlocalpath);
  console.log("Cover image file path:", coverimagelocalpath);

  // Check that avatar file is provided
  if (!avatarlocalpath) {
    throw new apierror(400, "Avatar file is required");
  }

  // Optional: If cover image is required, uncomment below
  // if (!coverimagelocalpath) {
  //   throw new apierror(400, "Cover image file is required");
  // }

  // Upload files to Cloudinary
  const avatar = await uploadcloudinary(avatarlocalpath);
  const coverimage = coverimagelocalpath ? await uploadcloudinary(coverimagelocalpath) : null;

  console.log("Uploaded avatar:", avatar);
  console.log("Uploaded coverimage:", coverimage);

  if (!avatar) {
    throw new apierror(400, "Failed to upload avatar");
  }

  // Create user in DB
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Fetch user without sensitive fields
  const createduser = await User.findById(user._id).select("-password -refreshtoken");
  if (!createduser) {
    throw new apierror(500, "Something went wrong");
  }

  // Return success response
  return res.status(201).json(new apiresponse(200, createduser, "User registered successfully"));
});


const loginuser = asynchandler(async(req,res)=> {
  // req body data
  //username or email
  // find the user
  // password check
  // access and refresh token
  // cokkies


  //req body data
  const {email , username,password}= req.body
  if(!(username || email)){
    throw new apierror (400 , "username or pass is rq")
  }
  const userss = await User.findOne({
    $or:[{username}, {email}]
  })
  console.log("either email or password",userss);
  

  if (!userss){
    throw new apierror(404 , "userss donot exist")
  }

 const ispasswordvalid = await userss.ispasswordcorrect(password)
 console.log("password coreect or not " , ispasswordvalid);
 if (!ispasswordvalid){
    throw new apierror(401 , "password incorrect")
  }

  const {accesstoken, refereshtoken} = await generateaccessandrefereshtoken(userss._Id)
const  loginuser  = await User.findById(user._Id).select("-password -refreshtoken")
const options = {
  httpOnly :true ,
  secure :true ,
}
 return res.status(200).cookie("accesstoken" , accesstoken , options).cookie("refreshtoken" , refereshtoken ,options).json(
  new apiresponse(200, 
    {
      userss : loginuser ,accesstoken , refereshtoken
    },
    "user logg in success"
  )
 )

})
const logoutuser = asynchandler(async(req, res)=>{
  User.findByIdAndUpdate(req.user.id,

    {$set:{
      refreshtoken:undefined
    },
},
{
  new:true
}
  )
  const options = {
  httpOnly :true ,
  secure :true ,
   
}
return res.status(200)
.clearCookie("accesstoken", options)
.clearCookie("refreshtoken", options)
.json(new apiresponse(200, {} , "user loggged out successfly"))


})


const refreshacccesstoken = asynchandler(async(req,res)=>{
  const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken
if(!incomingrefreshtoken){throw new apierror (401 , "unauthorizes req")}
try {
  const decodetoken=jwt.verify( 
    incomingrefreshtoken, 
    process.env.REFRESH_TOKEN_SECRET
  )
  
  const user = await User.findById(decodetoken?._Id)
  if(!user ){
    throw new apierror(401 , "unauth")
  }
  
  if(incomingrefreshtoken !== user?.refreshtoken){
    throw new apierror(401 , "urefresh token is expired or used")
  }
  
  const options = {
    httpOnly :true ,
    secure :true ,
  }
  
  const {accesstoken , newrefreshtoken}=await generateaccessandrefereshtoken(user._id)
  
   return res.status(200).cookie("accesstoken" , accesstoken , options).cookie("refreshtoken" , newrefreshtoken,options).json(
    new apiresponse(200, 
      {
        userss : accesstoken ,refreshtoken : newrefereshtoken
      },
      "user logg in success"
    )
   )
  
} catch (error) {
  throw new apierror(401 , error?.message || "invaliddddd")
  
}



})


const changecurrentpassword = asynchandler(async(req,res)=>{
   const {oldpassword  , newpassword} = req.body
 const user =await User.findById(req.user?._id)
 const ispasswordcorrect= await user.ispasswordcorrect(oldpassword)
 if (!ispasswordcorrect){
  throw new apierror(400 ,"wrong")
 }
 user.password = newpassword

  await user.save({validateBeforSave :save})

  return res.status(200)
  .json(new apiresponse(200 , {} , "password changed"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))
})

const updateaccountdetails = asynchandler(async(req,res)=>{
  const {fullname , email} = req.body
  if (!fullname|| !email){
    throw new apierror(400 , "all field are req")
  }
  const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        {new: true}
        
    ).select("-password")

    return res
    .status(200)
    .json(new apiresponse(200, user, "Account details updated successfully"))

})


const updateuseravatar = asynchandler(async(req, res)=>{
  
})


export { registeruser  
  , loginuser
  
, logoutuser  

,  refreshacccesstoken
, changecurrentpassword
,getCurrentUser

, updateaccountdetails

};
