import { Application } from "../Models/applicationmodel.js";
import { Job } from "../Models/jobmodel.js";

export const applyJobs=async(req,res)=>{
    try{
        const userId=req.id;
        const{id:jobId}=req.params;
        if(!jobId){
            return res.status(400).json({
                message:"Invalid job id",
                sucess:false
            })
        }
const existingApplication= await Application.findOne({job:jobId,applicant:userId})
if(existingApplication){
    return res.status(400).json({
        message:"you have already applied",
        sucess:false
    })
}
const job= await Job.findById(jobId)
if(!job){
    return res.status(404).json({
        message:"Job not found",
        sucess:false
    })
    

}
//create a new application

const newApplication= await Application.create({
    job:jobId,
    applicant:userId,
})
job.applications.push(newApplication._id);
await job.save();
return res.status(201).json({
    message:"job applied successfully",
    sucess:true
})
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:err.message,
            sucess:false
        })

    }
}


//get aplied job


export const getAppliedJobs=async(req,res)=>{
    try{
        const userId=req.id;
        const application = await Application.find({applicant:userId}).populate({
            path:"job",
            populate:{
                path:"company",
            }

        }).sort({createdAt:-1})
        if(!application){
            return res.status(404).json({
                message:"No job applied",
                
            })
        }
return res.status(200).json({
    message:"Jobs applied successfully",
    application,
    sucess:true
})
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:"error in get applied job",
            sucess:false
        })
    }
}

//get aplicants

export const getApplicants=async(req,res)=>{
    try{
const jobId=req.params.id;
const job = await Job.findById(jobId).populate({
    path:"applications",
    populate:{
        path:"applicant",
    }

}).sort({createdAt:-1})
if(!job){
    return res.status(404).json({
        message:"No job found",
        sucess:false
        })
}
return res.status(200).json({
    message:"Applicants found successfully",
    job,
    sucess:true
})
    }catch(err){
        console.log(err);
        res.status(500).send({
            message:"error in get applicants",
            sucess:false
            })
    }
}

//upadte status

export const updateStatus=async(req,res)=>{
    try{
        const{status}=req.body;
        const applicationId=req.params.id;
        if(!status){
            return res.status(400).json({
                message:"status is required",
                sucess:false
            })
            
        }

const application= await Application.findOne({_id:applicationId});
if(!application){
    return res.status(404).json({
        message:"Application not found",
        sucess:false
    })
}

//update status
application.status=status.toLowerCase();
await application.save();

return res.status(200).json({
    message:"status updated successfully",
    application,
    sucess:true
})


    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"eror in updtaing",
            sucess:false
        })
    }
}