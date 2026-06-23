import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName:{type:String,required : true},
    lastName : {type:String},
    profilePic : {type : String},
    profilePicPublicId :{type:String}, //use to delete prevous uploaded image from cloudinary
    email:{type:String, required : true , unique : true},
    password : {type:String},
    role:{
        type: String,
        enum:["User","Admin"],
        default:"User"
    },
    token : {type : String},
    isverified : {type : Boolean , default:false}, // check before login to verify
    isLogedIn : { type : Boolean , default : false},
    otp : {type:String, default:null},
    otpExpiry : {type:Date,default:null},
    address :{type : String},
    city :{type:String},
    zipcode :{type:String},
    PhoneNumber:{type:Number}
},{timestamps:true})

export const User = mongoose.model("User",userSchema)