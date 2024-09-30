import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "./images/logo3.png";
import "./styles/header.css";

function Header() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    
    navigate("/");
    return;
  };


  return (
    <>
    <div className="head2">
      <div className="container">
        <div className="header">
          <div className="box1">
            <img src={logo} className="img1" alt="" />
            <h1 className="head1">ToDo</h1>
          </div>
          <ul className="order">
            <li className="item">
              {"Hello    "+localStorage.getItem("username")}
            </li>
            
            <li className="item">
              
            </li>
          </ul>
        </div>
        <div className="logout">
          <button className="l1" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      </div>
    </>
  );
}

export default Header;
