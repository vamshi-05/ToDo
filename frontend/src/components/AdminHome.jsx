import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/adminhome.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";

function AdminHome() {
  const [tasks, setTasks] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const adminemail=localStorage.getItem("email")
  const [newTask, setNewTask] = useState({
    userEmail:"",
    title: "",
    description: "",
    dueDate: "",
    assignedUser: adminemail,
    priority: "Low",
    status: "To Do",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({
    status: "All",
    priority: "All",
    assignedUser: "All",
  });

  useEffect(() => {
    fetchTasks();
    fetchRegisteredUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:4000/admin/tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response)
      if (response.data.status === "success") {
        console.log("succ")
        const sortedTasks = response.data.tasks.sort((a, b) => {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          const priorityOrder = { Low: 1, Medium: 2, High: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        setTasks(sortedTasks);
        console.log("tasks")
      } else {
        toast.error(response.data.message);

      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      toast.error(error.message);
    }
  };

  // Fetch registered users
  const fetchRegisteredUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/admin/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data)
      setRegisteredUsers(response.data.users);
      
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load registered users.");
    }
  };

  // Add a new task and assign to a user
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/admin/addtask",
        newTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.status === "success") {
        fetchTasks();
        toast.success(response.data.message);
        setNewTask({
          userEmail:"",
          title: "",
          description: "",
          dueDate: "",
          assignedUser: adminemail,
          priority: "Low",
          status: "To Do",
        });
        setIsModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to add task", error);
      toast.error(error.message);
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/admin/${taskId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.status === "success") {
        fetchTasks();
        toast.success("Task Deleted");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to delete task", error);
      toast.error("Failed to delete task");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-CA");
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filter.status === "All" || task.status === filter.status;
    const matchesPriority =
      filter.priority === "All" || task.priority === filter.priority;
    const matchesAssignedUser =
      filter.assignedUser === "All" ||
      task.userEmail === filter.assignedUser;
    return (
      matchesSearch && matchesStatus && matchesPriority && matchesAssignedUser
    );
  });

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <>
      <Header/>
      <div className="adminhome">
        <div className="admin-task-manager-container">
          <h1>Admin Task Manager</h1>

          <div className="search-filters-container">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="filters">
              <select
                value={filter.status}
                onChange={(e) =>
                  setFilter({ ...filter, status: e.target.value })
                }
              >
                <option value="All">All Status</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <select
                value={filter.priority}
                onChange={(e) =>
                  setFilter({ ...filter, priority: e.target.value })
                }
              >
                <option value="All">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <select
                value={filter.assignedUser}
                onChange={(e) =>
                  setFilter({ ...filter, assignedUser: e.target.value })
                }
              >
                <option value="All">All Assigned Users</option>
                {registeredUsers.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="open-modal-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Assign Task
          </button>

          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content-new">
                <h2>Assign Task to User</h2>
                <form className="task-form" onSubmit={addTask}>
                  <b>Title</b>
                  <input
                    type="text"
                    placeholder="Title"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    required
                  />
                  <b>Description</b>
                  <textarea
                    placeholder="Description"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    required
                  ></textarea>
                  <b>Due Date</b>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    required
                  />
                  <b>Assign User</b>
                  <select
                    value={newTask.userEmail}
                    onChange={(e) =>
                      setNewTask({ ...newTask, userEmail: e.target.value })
                    }
                    required
                  >
                    <option value="">Select User</option>
                    {registeredUsers.map((user) => (
                      <option key={user.email} value={user.email}>
                        {user.email}
                      </option>
                    ))}
                  </select>
                  <b>Priority</b>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                <div className="modal-actions">
                
                <button
                  className="close-modal-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                  <button type="submit">Add Task</button>
                </div>
                </form>
              </div>
            </div>
          )}

          <div className="task-table">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Assigned User</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task.taskId}>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{formatDate(task.dueDate)}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                    <td>{task.userEmail}</td>
                    <td>
                      <button onClick={() => deleteTask(task.taskId)}>
                        Delete
                      </button>
                      {/* Add edit/assign functionality as needed */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index + 1}
                  className={currentPage === index + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default AdminHome;
