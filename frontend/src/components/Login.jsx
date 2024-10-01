import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo3 from "./images/logo3.png";
// import Header1 from "./Header1";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/login.css";
import validator from "validator"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    
    if (!validator.isEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (validator.isEmpty(password)) {
      toast.error("Password cannot be empty");
      return;
    }

    // console.log("clicked")
    try {
      const response = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });
      // console.log(response)
      if (response.data.status === "success") {
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("email",response.data.email)
        localStorage.setItem("username",response.data.username)
        toast.success("Login successful!", {
          autoClose: 1000,
          onClose: () => {
            if(response.data.role==="user"){
              window.open('/home', '_self');
              return ;
            }
            else{
              window.open('/adminhome', '_self');
              return ;
            }

          },
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Invalid Credentials");
    }
  };
  return (
    <>
      <div className="ultralogin">
        <div className="prologin">
          <div className="masslogin">
            <div className="box">
              <div className="container">
                <div className="name1">
                  <img src={logo3} id="logo" alt="" />
                </div>
                <div className="name2">
                  <h3>ToDo</h3>{" "}
                </div>
                
              </div>
              <div className="box2">
                <h1 className="friends">Welcome Back!</h1>

                <p className="item">
                  Email
                  <input
                    type="text"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  />
                </p>

                <p className="item">
                  Password
                  <input
                    type="text"
                    className="input"
                    placeholder="Your password"
                    value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                </p>

                <p className="">
                  <button onClick={()=>handleLogin()}>Log In</button>
                </p>

                <p className="friends">
                  Don't have an account? <NavLink to="/register">Sign up now</NavLink>
                </p>
              </div>
            </div>

            <div className="fullbox">
              <div className="smallbox">
                <h1 className="welcome">Welcome Back!</h1>

                <img className="cls" src={logo3} alt="" />
                <h1 className="heading">ToDo</h1>
                
              </div>
              <div >
                  <NavLink to="/register"> <label className="label">Sign Up</label></NavLink>
                </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </>
  );
}

export default Login;
