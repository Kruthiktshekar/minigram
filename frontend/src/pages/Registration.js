import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosApi } from "../axios";

function Registration() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [registerClientSideErrors, setRegisterClientSideErrors] = useState({});
  const clientSideErrors = {};

  const navigate = useNavigate();

  const runClientSideValidation = () => {
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const digitRegex = /\d/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      clientSideErrors.email = "Enter a valid email id";
    } else if (name.trim().length === 0) {
      clientSideErrors.name = "name cannot be empty";
    } else if (userName.trim().length === 0) {
      clientSideErrors.username = "username cannot be empty";
    } else if (password.trim().length === 0) {
      clientSideErrors.password = "Password cannot be empty";
    } else if (password.length > 128 || password.length < 4) {
      clientSideErrors.password = "Password should be greater than 4 digits";
    } else if (!upperCaseRegex.test(password)) {
      clientSideErrors.password =
        "Password should contain atleast 1 uppercase , 1 lowercase, 1 digit and 1 special character";
    } else if (!lowerCaseRegex.test(password)) {
      clientSideErrors.password =
        "Password should contain atleast 1 uppercase , 1 lowercase, 1 digit and 1 special character";
    } else if (!specialCharRegex.test(password)) {
      clientSideErrors.password =
        "Password should contain atleast 1 uppercase , 1 lowercase, 1 digit and 1 special character";
    } else if (!digitRegex.test(password)) {
      clientSideErrors.password =
        "Password should contain atleast 1 uppercase , 1 lowercase, 1 digit and 1 special character";
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = {
      email: email,
      fullname: name,
      username: userName,
      password: password,
    };
    console.log(formData)
    runClientSideValidation();
    if (Object.keys(clientSideErrors).length === 0) {
      try {
        const response = await axiosApi.post(
          "/signup",
          formData
        );
        if (response) {
          toast.success('OTP sent successfully', { autoClose: 1000 })
          sessionStorage.setItem("email", email);
          navigate("/verify");
          // setEmail("");
          // setName("");
          // setUserName("");
          // setPassword("");
        } 
      }  catch (error) {
        console.log(error)
        toast.error(error.response.data.message, { autoClose: 1000 })
      }
        setEmail("");
        setName("");
        setUserName("");
        setPassword("");
      }
     else {
      setRegisterClientSideErrors(clientSideErrors);
    }
  };

  return (
    <div className="container">
      <div className="signup-container">
        <div className="form-box">
          <h1>Minigram</h1>
          <p className="signup-text">
            Sign up to see photos and videos from your friends.
          </p>
          <button className="fb-login">Log in with Facebook</button>
          <div className="divider">OR</div>
          <form>
            {registerClientSideErrors.email && (
              <p style={{ color: "red" }}>{registerClientSideErrors.email}</p>
            )}
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {registerClientSideErrors.name && (
              <p style={{ color: "red" }}>{registerClientSideErrors.name}</p>
            )}
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {registerClientSideErrors.username && (
              <p style={{ color: "red" }}>{registerClientSideErrors.username}</p>
            )}
            <input
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            {registerClientSideErrors.password && (
              <p style={{ color: "red" }}>{registerClientSideErrors.password}</p>
            )}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" onClick={submitHandler}>
              Sign up
            </button>
          </form>
        </div>
        <div className="login-box">
          <p>
            Have an account? <Link to="login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;
