
import { Compnay } from "../Models/companymodel.js";
import cloudinary from "../utils/Cloudinary.js";
import getDataUri from "../utils/DataUri.js";

//register company heere
export const registerCompany = async(req,res)=>{
    try{
const{companyName}=req.body;
if(!companyName){
    return res.status(400).json({
        message:"Company name is required",
        success:false
    });
}
let company=await Compnay.findOne({name:companyName});
if(company){
    return res.status(400).json({
        message:"Company already exists",
        success:false
    })
};
company = await Compnay.create({
    name:companyName,
    userId:req.id

})
res.status(201).json({
    message:"Company created successfully",
    company,
    success:true

})
    }catch(err){
        console.log(err)
        res.status(500).send({
            message:"Error register company",
            success:false
        })
    }
}

//get company here

export const getCompany=async(req,res)=>{
try{
    const userId=req.id;
    const companies=await Compnay.find({userId});
    if(!companies){
        return res.status(404).json({
            message:"Company not found",
            success:false
        })
    }
    return res.status(200).json({
        companies,
        success:true
    })

}catch(err){
    res.status(500).send({
        message:"Error in getting all company list",
        success:false
    })
}
}

///get company by id


export const getCompanyId=async(req,res)=>{
    try{
const comapnyId=req.params.id;
const company=await Compnay.findById(comapnyId);
if(!company){
    return res.status(404).json({
        message:"Company not found",
        success:false
    })

}
return res.status(200).json({
    company,
    message:"Company found",
    success:true,
})
    }catch(err){
        res.status(500).send({
            message:"error in getting comapny by id",
            success:false
        })
    }
}

//update company here


export const updateCompany=async(req,res)=>{
    try{
        const {name,description,website,location}=req.body;
        const file=req.file;
        //cloudnary
       const fileUri=getDataUri(file)
       const cloudResponse=await cloudinary.uploader.upload(fileUri.content);
       const logo= cloudResponse.secure_url;
       


        const updateData= {name,description,website,location,logo}
        //console.log(name,description,website,location)
        const company=await Compnay.findByIdAndUpdate(req.params.id,updateData,{
            new:true,
        })
        if(!company){
            return res.status(404).json({
                message:"comapny not found",
                success:false
            })
        }

        return res.status(200).json({
            message:"company information updated",
            success:true
        })

    }catch(err){
        console.log(err)
        res.status(500).send({
            message:"Error in updating company",
            success:false
        })
    }
}