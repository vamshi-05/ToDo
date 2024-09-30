const taskModel = require("../model/task.model");
const { v4: uuidv4 } = require('uuid');

// const getUserComplaints = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     //console.log(userId)
//     const complaints = await taskModel.find({});
//     res.status(200).json(complaints);
//   } catch (error) {
//     res.status(404).send(error);
//   }
// };

const getTasks = async (req, res) => {
  try {
    //console.log("hello");
    const email = req.user.email;
    console.log(email);
    const tasks = await taskModel.find({ userEmail: email });
  
    res.json({status : "success",tasks})
  } catch (error) {
    console.error(error);
    res.json({status : "fail",messsage : "Unable to fetch tasks"})
  }
};

const addTask = async (req, res) => {
  try {
    const task=req.body;
    const taskId = uuidv4();
    const newtask={...task,taskId}
    console.log(newtask)
    await taskModel.create(newtask);
    //console.log("hii")
    res.json({ status : "success",message: "Task added to list" });
  } catch (error) {
    console.error(error)
    res.json({ status : "fail",message: "Failed to add task" }); 
   }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const email = req.user.email;
    const item = await taskModel.findOneAndDelete({
      userEmail: email,
      taskId: taskId,
    });
    //console.log(item);
    if (!item) 
      res.json({ status : "fail",message: "Task Not Found" }); 
    else 
    res.json({ status : "success",item });
  } catch (error) {
    res.json({ status : "fail",message: "Failed to delete Task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const status = req.body.status;
    const taskId = req.params.taskId;
    const email = req.user.email;
    //console.log(nature,userId)
    console.log(status)
    const item = await taskModel.findOneAndUpdate({
      userEmail: email,
      taskId: taskId,
    },{
        status : status
    });
    //console.log(item);
    if (!item) 
      res.json({ status : "fail",message: "Task Not Found" }); 
    else 
    res.json({ status : "success",item });
  } catch (error) {
    res.json({ status : "fail",message: "Failed to update Task" });
  }
};

module.exports = {
  getTasks,
  // getUserComplaints,
  addTask,
  deleteTask,
  updateTask,
};
