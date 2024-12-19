import { User } from "../Models/usermodel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/DataUri.js";
import cloudinary from "../utils/Cloudinary.js";



//register controller start here

export const register=async(req,res)=>{
    try{
        const{fullname, email, phoneNumber,password,role}=req.body;
        if(!fullname || !  email || ! phoneNumber || !password || !role){
            return res.status(400).json({
                message:"Please fill in all fields",
                sucess:false

                })
        };
      //cloudinary;
      const file=req.file;
      const fileUri=getDataUri(file);
      const cloudResponse= await cloudinary.uploader.upload(fileUri.content)

        const user= await User.findOne({email});
        if(user){
            return res.status(400).json({
                message:"Email already exists",
                sucess:false
            })
        }
        const hashedPassword = await bcrypt.hash(password,10) 
        await User.create({
            fullname,
            email,
            phoneNumber,
            password:hashedPassword,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,

            }
            
        })
return res.status(201).json({
    message:"Account created successfully",
    sucess:true,
})

    }catch(err){
        console.log(err)
        res.status(500).send({message:"Error registering user"})
    }
}

//login controller start here


export const login=async(req,res)=>{
    try{
const {email,password,role}=req.body
if( !email || !password || !role){
    return res.status(400).json({
        message:"Please fill in all fields",
        sucess:false
        })
};
const user=await User.findOne({email})
if(!user){
    return res.status(400).json({
        message:"Invalid email or password",
        sucess:false
    })
}
const isPasswordMatch= await bcrypt.compare(password, user.password);
if(!isPasswordMatch){
    return res.status(400).json({
        message:"Invalid email or password",
        sucess:false
    })
}

//check role
if(role!=user.role){
    return res.status(400).json({
        message:"Account doesn't exist with current role",
        sucess:false
    })
}

//generate token
{/* */}


const tokenData={
    userId:user._id,
    
}

const token = await jwt.sign(tokenData, process.env.SECRET_KEY,{ expiresIn:'1d' }) 
res.cookie('token',token,{maxAge:1*24*60*60*1000,httpOnly:true,secure:true, SameSite:"none"}).json({
    message:`Welcome Back ${user.fullname}`,
    user:user,
    sucess:true,
    token:token
})

    }catch(err){
        res.status(500).send({message:"Error logging in user"})
    }
}

//logout controller


export const logout=async(req,res)=>{
    try{
        return res.status(200).cookie('token',"",{maxAge:0}).json({
            message:"Logged out successfully",
            sucess:true
        })

    }catch(err){
        res.status(500).send({message:"Error logout user",sucess:false})
    }
}


///update profile

export const updateProfile=async(req,res)=>{
    try{
        const{fullname, email, phoneNumber,bio, skills}=req.body
       // console.log(fullname, email, phoneNumber,bio, skills);


          //cloudnary 
          const file=req.file;
          const fileUri=getDataUri(file);
          const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
        //console.log(cloudResponse)


        


        let skillsArray;
        if(skills){
            skillsArray=skills.split(",");
        }
        const userId=req.id;
        let user= await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                sucess:false
            })
        }

if(fullname)user.fullname=fullname
if(email)user.email=email
if(phoneNumber)user.phoneNumber=phoneNumber
if(bio)user.profile.bio=bio
if(skills)user.profile.skills=skillsArray


     // resume comes later here...
     if(cloudResponse){
        user.profile.resume =  cloudResponse.secure_url // save the cloudinary url
        user.profile.resumeOriginalName = file.originalname // Save the original file name
    }
//console.log(cloudResponse.secure_url)

await user.save();
user={
    _id:user._id,
    fullname:user.fullname,
    email:user.email,
    role:user.role,
    phoneNumber:user.phoneNumber,
    profile:user.profile,
   
}
return res.status(200).json({
    message:"profile update successfully",
    user:user,
    sucess:true,
})

    }catch(err){
        console.log(err)
        res.status(500).send({message:"Error updating profile"})
    }
}


//forget password api here


export const ForgetPassword=async(req,res)=>{
    const { email } = req.body;
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
      }
      const secret =process.env.SECRET_KEY + oldUser.password;
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "10m",
      });
      const link = `http://localhost:8080/api/v1/user/reset-password/${oldUser._id}/${token}`;
      console.log({link})
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "rajputrohitbcs@gmail.com",
          pass: "cffs mkyp hvtj srdm",
        },
      });
      
  
      var mailOptions = {
        from: "rajputrohitbcs@gmail.com",
        to: email,
        subject: " Reset Your Password",
        text: link,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      console.log(link);
    } catch (error) {}
}

//reset password
export const ResetPassword=async(req,res)=>{
   
    const { id, token } = req.params;
    console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = process.env.SECRET_KEY + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      res.render("index", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
   
}
export const PostResetPassword=async(req,res)=>{
    const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = process.env.SECRET_KEY + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
   
}