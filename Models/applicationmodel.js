import mongoose from "mongoose";


const applictionSchema= new mongoose.Schema({
    job:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job",
        required:true
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"

    }

},{timestamps:true})

export const Application = mongoose.model('Application',applictionSchema);