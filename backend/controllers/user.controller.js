const userModel=require('../model/user.model')
const jwt=require('jsonwebtoken')
require('dotenv').config()
const secret=process.env.SECRET

const checkUser=async(req,res)=>{
    try{
        //console.log(req.body)
        const {email,password}=req.body;

        const user=await userModel.findOne({"email" : email})
        const username=user.username
        //console.log(user)
        if(user && user.password===password){
            //const userId=user.id
            const role=user.role
            //console.log(user)
                
            jwt.sign({user},secret,(err,token)=>{
                if(!err)
                {
                    console.log(token)
                    res.json({status : "success",token,username,email,role})
                }
                else
                res.json({status : "fail",message : "JWT error"})
            })
        }
        else{
            res.json({status : "fail",message : "Invalid Credentials"})
        }

    }
    catch(error){
        res.status(404).json({status : "fail",message : "Internal error"})
    }
}


const saveUser=async(req,res)=>{
    const user=req.body
    //console.log("h",user)
    try{
        const existingUser=await userModel.findOne({"email" : user.email})
        
        //console.log(existingUser)
        //console.log(existingUsername)
        if(existingUser){
            res.json({status : "fail",message : "user already exists ! please login"})
        }
        else{
            await userModel.create(user)
            res.json({status : "success",message : "Registered Successfully"})
        }
    }
    catch(error){
        res.status(404).json({status : "fail",message : "Internal Error"})
    }
}



module.exports={
    checkUser,
    saveUser
}
