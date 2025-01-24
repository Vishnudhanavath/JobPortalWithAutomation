import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minLength: [3, "Name must cotain at least 3 characters."],
        maxLength: [100, "Name cannot exceed 30 characters."],
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['Job Seeker','Recruiter']
    },
    password:{
        type:String,
        required:true,
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String,url:String},
        profilePhoto:{
            type:String,
            default:""
        }
    },
    niches: {
        firstNiche: String,
        secondNiche: String,
        thirdNiche: String,
    },
},{timestamps:true});
export const User = mongoose.model('User',userSchema);