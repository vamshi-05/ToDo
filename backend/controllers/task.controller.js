const taskModel = require("../model/task.model");
const { v4: uuidv4 } = require("uuid");
const { Parser } = require('json2csv');

const getTasks = async (req, res) => {
  try {
    
    const email = req.user.email;
    
    const tasks = await taskModel.find({ userEmail: email });

    res.json({ status: "success", tasks });
  } catch (error) {
 
    res.json({ status: "fail", messsage: "Unable to fetch tasks" });
  }
};

const addTask = async (req, res) => {
  try {
    const task = req.body;
    const taskId = uuidv4();
    const newtask = { ...task, taskId };
   
    await taskModel.create(newtask);
   
    res.json({ status: "success", message: "Task added to list" });
  } catch (error) {
 
    res.json({ status: "fail", message: "Failed to add task" });
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
   
    if (!item) res.json({ status: "fail", message: "Task Not Found" });
    else res.json({ status: "success", item });
  } catch (error) {
    res.json({ status: "fail", message: "Failed to delete Task" });
  }
};

const updateTask = async (req, res) => {
  try {
    const status = req.body.status;
    const taskId = req.params.taskId;
    const email = req.user.email;
   
    const item = await taskModel.findOneAndUpdate(
      {
        userEmail: email,
        taskId: taskId,
      },
      {
        status: status,
      }
    );
   
    if (!item) res.json({ status: "fail", message: "Task Not Found" });
    else res.json({ status: "success", item });
  } catch (error) {
    res.json({ status: "fail", message: "Failed to update Task" });
  }
};

const summary = async (req, res) => {
  try {
    const { status, userEmail, startDate, endDate } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (userEmail) query.userEmail = userEmail;
    if (startDate && endDate) {
      query.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const tasks = await taskModel.find(query);

    if (tasks.length === 0) {
      
      return res.status(404).json({ message: "No tasks found" });
    }

    const fields = [
      "title",
      "description",
      "dueDate",
      "assignedUser",
      "priority",
      "status",
    ];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(tasks);

    res.header("Content-Type", "text/csv");
    res.attachment("tasks_report.csv");

    res.send(csv);
  } catch (error) {

    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTasks,
  // getUserComplaints,
  addTask,
  deleteTask,
  updateTask,
  summary
};
