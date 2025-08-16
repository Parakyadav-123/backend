// import mongoose from  "mongoose"
// import { DB_NAME } from "./constants.js";

// const connectDB = async () => {
//     try {
//        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n monogo connected : ${connectionInstance.connection.host}`);
        
//     } catch (error) {
//         console.log("mongoDB connection error" , error);
//         process.exit(1)
        
//     }
// }
// export default connectDB

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\nMongoDB connected: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
