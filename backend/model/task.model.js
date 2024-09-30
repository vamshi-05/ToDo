const mongoose=require('mongoose')

const taskSchema=mongoose.Schema({
    userEmail : {type : String, required : true },
    taskId : {type : String, },
    title : {type : String, },
    description : {type : String, },
    dueDate : {type : Date, },
    status : {
        type : String,
        enum : ["To Do","In Progress", "Completed"]
    },
    assignedUser : {type : String, },
    priority : {
        type : String,
        enum : ["Low", "Medium", "High"]
    },
})

const taskModel =mongoose.model("task",taskSchema)

module.exports=taskModel