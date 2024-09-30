const jwt=require('jsonwebtoken')
require('dotenv')
const secret=process.env.SECRET

const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.json({status : "fail", "message": "Not authorized" })
            return;
        }
        console.log(secret)
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, secret, (err, data) => {
            if (!err) {
                req.user = data.user
                next()
            }
            else
                res.json({status : "fail",  "message": "Not athorized" })
        })
    }
    catch (error) {
        res.json({ status : "fail", "message": "unable to verify" })
    }
}

const isAdmin=(req,res,next)=>{
    console.log(req.user)
    const role=req.user.role
    //console.log(role)
    if(role.toLowerCase()==="admin")
        next()
    else
        res.json({status : "fail", "message" : "Not an admin"})
}

const isUser=(req,res,next)=>{
    console.log(req.user)
    const role=req.user.role
    //console.log(role)
    if(role.toLowerCase()==="user")
        next()
    else
        res.json({status : "fail", "message" : "Not an user"})
}

module.exports={
    verifyToken,
    isAdmin,
    isUser
}