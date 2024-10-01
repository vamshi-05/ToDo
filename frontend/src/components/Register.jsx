import React, { useState } from "react";
import axios from "axios";
import logo3 from "./images/logo3.png";
import "./styles/register.css";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from "validator"


function Register() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user"); // default role is set to "user"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (validator.isEmpty(username)) {
      toast.error("Username is required");
      return;
    }
    
    if (!validator.isEmail(email)) {
      toast.error("Invalid email address");
      return;
    }
    
    if (validator.isEmpty(password)) {
      toast.error("Password is required");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!validator.isMobilePhone(mobileNumber, 'en-IN')) {
      toast.error("Invalid mobile number");
      return;
    }

    try {
      const user = {
        email,
        username,
        password,
        role,
        mobileNumber,
      };

    

      const response = await axios.post(
        "http://localhost:4000/auth/signup",
        user
      );

      if (response.data.status === "success") {
        toast.success("Registration Successful", {
          autoClose: 2000,
          onClose: () => {
            navigate("/login");
          },
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      // console.error(error);
      toast.error("Internal Error");
    }
  };

  return (
    <>
      <div className="ultraregister">
          <form onSubmit={handleRegister}>
        <div className="proregister">
            <div className="massregister">
              <div className="design">
                <div className="item1">
                  <h1>Hello Friend!</h1>
                  <h3>Welcome to ToDo website</h3>
                  <div className="img1">
                    <img className="cls" src={logo3} alt="ToDo Logo" />
                    <h1 className="heading">ToDo</h1>

                  </div>
                  <NavLink to="/login"> <button>Sign in</button></NavLink>
                </div>
              </div>
              <div className="box">
                <h1>Create your account</h1>
                <h2 className="error"></h2>
                <div className="con1">
                  <div className="con2">
                    <p>Full Name </p>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter your Name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)} // handle input change
                    />
                    <p>Email </p>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)} // handle input change
                    />
                    <p>Password </p>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} // handle input change
                    />
                  </div>
                  <div className="con3">
                    <p>Role</p>
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)} // handle dropdown selection
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>

                    <p>Mobile No </p>
                    <input
                      type="text"
                      id="phone"
                      placeholder="Mobile no"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)} // handle input change
                    />
                    <p>Confirm password </p>
                    <input
                      type="password"
                      id="Cpassword"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)} // handle input change
                    />
                  </div>
                </div>
                <div className="">
                  <p>
                    <input type="checkbox" name="" id="" /> By Signing Up I
                    Agree with
                    <NavLink to="/login" className="terms">
                      Terms & Conditions
                    </NavLink>
                  </p>
                </div>
                <div className="btn">
                  <p>
                    <button className="btn1" type="submit">
                      Sign Up
                    </button>
                  </p>
                </div>
                <p className="signin">
                  Already have an account?{" "}
                  <NavLink to="/login">Sign in</NavLink>
                </p>
              </div>
            </div>
        </div>
          </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default Register;
