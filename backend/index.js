const express=require('express');
const app=express();
const jwt=require('jsonwebtoken')
const cors=require('cors')
app.use(cors())

//Environmental variables
require('dotenv').config()
const port=process.env.PORT || 4000;
const database_url=process.env.MONGODB_URL;

//Routes
 const userRoutes=require('./routes/user.route')
 const adminRoutes=require('./routes/admin.route')
 const taskRoutes=require('./routes/task.route')
 const {verifyToken,isAdmin,isUser}=require('./middleware/authorization')

//mongDB connection
const mongoose=require('mongoose')
mongoose.connect(database_url)
.then((res)=>{console.log("connected successfully")})
.catch((err)=>{console.log(err)})


 app.use(express.json())
 app.use(express.urlencoded({extended : true}))

// //Routes
 app.use('/user',verifyToken,isUser,taskRoutes)
 app.use('/auth',userRoutes)
 app.use('/admin',verifyToken,isAdmin,adminRoutes)
app.get('/',(req,res)=>{
    res.status(200).send("hello page")
})

//server connection
app.listen(port,()=>{console.log(`server is listening at port ${port}`)})
