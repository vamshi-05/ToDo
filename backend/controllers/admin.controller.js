const userModel=require('../model/user.model')
const taskModel=require('../model/task.model')

const getUsers = async (req, res) => {
    try {

      const users = await userModel.find({role : "user"}, { email: 1, _id: 0 });
 
      res.json({status : "success",users})
    } 
    catch (error) {
    
      res.json({status : "fail",messsage : "Unable to fetch users"})
    }
  };

  const getTasks = async (req, res) => {
    try {
   
      const email = req.user.email;
    
      const tasks = await taskModel.find({ assignedUser: email });
    
      res.json({status : "success",tasks})
    } catch (error) {
    
      res.json({status : "fail",messsage : "Unable to fetch tasks"})
    }
  };
  

  const deleteTask = async (req, res) => {
    try {
      const taskId = req.params.id;
      const email = req.user.email;
      const item = await taskModel.findOneAndDelete({
        assignedUser: email,
        taskId: taskId,
      });
 
      if (!item) 
        res.json({ status : "fail",message: "Task Not Found" }); 
      else 
      res.json({ status : "success",item });
    } catch (error) {
      res.json({ status : "fail",message: "Failed to delete Task" });
    }
  };

  const getAdmins = async (req, res) => {
    try {
      
      const users = await userModel.find({role : "admin"}, { email: 1, _id: 0 });
     
      res.json({status : "success",users})
    } 
    catch (error) {

      res.json({status : "fail",messsage : "Unable to fetch users"})
    }
  };


module.exports={
    getUsers,
    getTasks,
    deleteTask,
    getAdmins
}
