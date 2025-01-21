import axios from "axios";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosApi } from "../axios";

export const VerifyEmail = () => {
  const email = sessionStorage.getItem("email");

  const navigate = useNavigate();
  const [otp, setOtp] = useState("");

  const otpHandler = async (e) => {
    e.preventDefault()
    const formData = {
      email,
      otp,
    };
    try {
      const response = await axiosApi.post(
        "/verify",
        formData
      );
      if (response) {
        toast.success('email verified successfully')
        // localStorage.setItem("token", response.data.token);
        setOtp("");
        alert("email has verified, You can login now..");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.message)
      setOtp("");
      navigate('/signup')
    }
  };
  return (
    <div className="d-grid text-center align-items-center justify-content-center mt-4">
      <p className="signup-text">
        Please verify your Email , Check your email - {email} for OTP{" "}
      </p>
      <div className="form-box ">
        <form>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
          />
          <br />
          <button onClick={otpHandler}>Verify</button>
        </form>
      </div>
    </div>
  );
};
