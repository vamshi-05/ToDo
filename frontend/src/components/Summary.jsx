import React, { useState,useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/summary.css";

const Summary = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState("");
  //const [userEmail, setUserEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const userEmail = localStorage.getItem("email");
  const handleDownloadCSV = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:4000/user/summary", {
        params: {
          status,
          userEmail,
          startDate,
          endDate,
        },

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "tasks_report.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.error("Summary generated successfully!")
      onClose();
      
    } catch (error) {
      // console.error("Error downloading CSV report:", error);
      toast.error("Failed to generate summary !")
    }
  };

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal is closed
      setStatus("");
      setStartDate("");
      setEndDate("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="summary">
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Task Summary Report</h2>
            <form onSubmit={handleDownloadCSV}>
              <div>
                <label>Status: </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              {/* <div>
            <label>User Email: </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="user@example.com"
            />
          </div> */}
              <div>
                <label>Start Date: </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label>End Date: </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit">Download CSV Report</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Summary;
