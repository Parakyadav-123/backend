import mongoose, {Schema} from "mongoose";
import mongooseaggregatePaginate from "mongoose-aggregate-paginate-v2"
const videoschema = new Schema({
  videofile :{
    type : String,
    required :true
  },

  thumbnail :{
    type : String,
    required :true
  },
  title :{
    type : String,
    required :true
  },
  discription:{
    type : String,
    required :true
  },
  duration0 :{
    type : String,
    required :true
  } ,
  view:{
    type : Number,
    default : 0
  } ,
    ispublished:{
    type : Boolean,
    default : true
  },
   owner :{
    type : Schema.Types.ObjectId,
    ref : "User"
   }




}, {
    timestamps:true
})

videoschema.plugin(mongooseaggregatePaginate)


export const video = mongoose.model("video" , videoschemaschema)