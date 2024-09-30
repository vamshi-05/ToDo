const mongoose=require('mongoose')

const userSchema=mongoose.Schema({ 
    email :{
        type : String,
        required : true,
        unique : true
    },
    password :{
        type : String,
        required : true
    },
    username :{
        type : String,
        required : true,
    },
    
    mobileNumber :{
        type : String,
        
    },
    
    active :Boolean,
    role :{
        type : String,
        enum : ["user","admin"]
    },
    
    
});

const userModel=mongoose.model("user",userSchema)

module.exports=userModel