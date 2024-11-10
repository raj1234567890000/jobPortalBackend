import { Job } from '../Models/jobmodel.js'



//new job posted here

export const postJob=async(req,res)=>{
    try{
        const {title,description, requirements,salary,location,jobType,experience,position,companyId}=req.body;
       const userId=req.id;
       if(!title|| !description || !requirements || !salary || !location || !jobType ||!experience || !position || !companyId){
        return res.status(400).json({
            message:"Please fill all the fields",
            success:false

        })
       }
{/*const jobs=await Job.find({userId})
if(jobs){
    return res.status(400).json({
        message:"job already created",
        success:false
    })
}
*/}
const job = await Job.create({
    title,
    description,
    requirements:requirements,
    salary,
    location,
    jobType,
    experience,
    position,
    company:companyId,
   created_by:userId
})
return res.status(201).json({
    message:"New Job Created successfully",
    job,
    success:true,
})

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error in job post",
            success:false,
        })
    }
}

//all job here

export const getAllJobs=async(req,res)=>{
    try{
        const keyword= req.query.keyword || "";
        const query={
            $or:[
                {title:{$regex:keyword,$options:"i"} },
                {description:{$regex:keyword,$options:"i"} },

            ]
        }
        const jobs=await Job.find(query).populate({
            path:"company",

        }).sort({createdAt:-1})
        if(!jobs){
            return res.status(404).json({
                message:"jobs not found",
                success:false
            })
        }
        return res.status(200).json({
            message:"jobs found",
            jobs,
            success:true
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error in getting all jobs",
            success:false,
        })
    }
}
//getjob by id user

export const getJobById=async(req,res)=>{
    try{
        const jobId=req.params.id;
        const job=await Job.findById(jobId).populate({
            path:"applications",

        }).sort({createdAt:-1})
        if(!job){
            return res.status(404).json({
                message:"job not found",
                success:false
            })
        }
        return res.status(200).json({
            message:"job found",
            job,
            success:true
        })

    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error in getting job by id",
            success:false
        })
    }
}

//get job by admin

export const  getAdminJobs=async(req,res)=>{
    try{
const adminId=req.id;
const jobs=await Job.find({created_by:adminId}).populate({
    path:"company",
    createdAt:-1
})
if(!jobs){
    return res.status(404).json({
        message:"jobs not found",
        success:false
    })
}
return res.status(200).json({
    message:"jobs found",
    jobs,
    success:true
})
    }catch(err){
        console.log(err)
        res.status(500).json({
            message:"error in admin job",
            success:false,
        })
    }
}

