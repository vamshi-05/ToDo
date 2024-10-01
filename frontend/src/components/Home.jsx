import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/home.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header";
import Summary from "./Summary";

function Home() {
  const [tasks, setTasks] = useState([]);
  const email = localStorage.getItem("email");
  const [registeredAdmins, setRegisteredAdmins] = useState([]);
  const [newTask, setNewTask] = useState({
    userEmail: email,
    title: "",
    description: "",
    dueDate: "",
    assignedUser: "self",
    priority: "Low",
    status: "To Do",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false); 

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(3);
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
      const response = await axios.get("http://localhost:4000/user/tasks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.status === "success") {
        const sortedTasks = response.data.tasks.sort((a, b) => {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);

          if (dateA < dateB) return -1;
          if (dateA > dateB) return 1;
          const priorityOrder = { Low: 1, Medium: 2, High: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        setTasks(sortedTasks);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.error("Failed to fetch tasks", error);
      toast.error(error.message);
    }
  };

  const fetchRegisteredUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4000/user/admins", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    
      setRegisteredAdmins(response.data.users);
      
    } catch (error) {
      // console.error("Failed to fetch admins", error);
      toast.error("Failed to load registered admins.");
    }
  };

  // Function to handle adding a new task
  const addTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/user/addtask",
        newTask,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status === "success") {
        fetchTasks(); // Refresh the task list
        toast.success(response.data.message);

        setNewTask({
          userEmail: email,
          title: "",
          description: "",
          dueDate: "",
          assignedUser: "",
          priority: "Low",
          status: "To Do",
        });
        setIsModalOpen(false); // Close modal after task is added
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.error("Failed to add task", error);
      toast.error(error.message);
    }
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    try {
      const response = await axios.delete(
        `http://localhost:4000/user/${taskId}`,
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.error("Failed to delete task", error);
      toast.error(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-CA'); 
  };

  // Function to update the status of a task
  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/user/update/${taskId}`,
        { status: newStatus },
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
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.error("Failed to update task", error);
      toast.error(error.message);
    }
  };

  // Search and filter tasks
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
      task.assignedUser === filter.assignedUser;

    return (
      matchesSearch && matchesStatus && matchesPriority && matchesAssignedUser
    );
  });

  // Paginate the filtered tasks
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <>
      <Header />
      <div className="userhome">
      <div className="task-manager-container">
        <h1>Task Manager</h1>

        <div className="search-filters-container">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filters */}
          <div className="filters">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
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
              {registeredAdmins.map((user) => (
                      <option key={user.email} value={user.email}>
                        {user.email}
                      </option>
                    ))}
            </select>
          </div>
        </div>

        {/* Button to open Add Task modal */}
        <div className="modal-buttons">
        <button className="open-modal-btn" onClick={() => setIsModalOpen(true)}>
          Add Task
        </button>
        
        <button className="open-modal-btn" onClick={() => setIsSummaryModalOpen(true)}>
            Generate Summary
          </button>
          </div>
        
          <Summary isOpen={isSummaryModalOpen} onClose={() => setIsSummaryModalOpen(false)} />

        {/* Modal for adding a task */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content-new">
              <h2>Add New Task</h2>
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
                <b>Status</b>
                <select
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
                <button type="submit">Add Task</button>
                </div>
              </form>
            </div>
          </div>
        )}

       
        {/* Displaying the tasks */}
      
        <div className="tasks">
          {currentTasks.map((task) => (
            <div key={task.taskId} className="task">
              <h3>{task.title.toUpperCase()}</h3>
              <p>{task.description}</p>
            
              <p>Due : {formatDate(task.dueDate)}</p>
              <p>Status : {task.status}</p>
              <p>Priority : {task.priority}</p>
              <p>Assigned User : {task.assignedUser}</p>
              <div className="task-actions">
                <button onClick={() => updateTaskStatus(task.taskId, "To Do")}>
                  To Do
                </button>
                <button
                  onClick={() => updateTaskStatus(task.taskId, "In Progress")}
                >
                  Mark as In Progress
                </button>
                <button
                  onClick={() => updateTaskStatus(task.taskId, "Completed")}
                >
                  Mark as Completed
                </button>
                
                <button 
                  onClick={() => deleteTask(task.taskId)}
                  disabled={task.assignedUser!=="self"}
                  >Delete</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <ToastContainer />
      </div>
      </div>
    </>
  );
}

export default Home;
