import jwt from "jsonwebtoken";

const isAuthenticate=async(req,res,next)=>{
    try{
       // console.log(req.cookies.token)
        const token=req.cookies.token;
        if(!token) {
            return res.status(401).json({ 
                msg: "Unauthorized user" ,
                status: false
            });

        }
const decode =await jwt.verify(token,process.env.SECRET_KEY);
if(!decode){
    return res.status(401).json({
        message:"inavlid token",
        status:false
    })
}
req.id=decode.userId;
next();
    }catch(err){
        
        res.status(500).json({message:err.message})
    }
}

export default isAuthenticate;