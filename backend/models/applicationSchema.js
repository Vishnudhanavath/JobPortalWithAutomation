import { application } from "express";
import mongoose from "mongoose"; 

const applicationSchema = new mongoose.Schema({
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    job:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    status:{
        type:String,
        enum:["pending","shortlisted","rejected","hired"],
        default:"pending"
    },
    resume:{
        public_id: String,
        url:String
    },
    appliedOn:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});


export const Application = mongoose.model("Application",applicationSchema); 
