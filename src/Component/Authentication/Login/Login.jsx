import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      // const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const res = await axios.post("https://investmentbackend-6m5g.onrender.com/api/auth/login", form);

      // Save token and user info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setSuccessMsg(res.data.message || "Login successful.");

      setLoading(false);

      // alert("Login successful");

      // Redirect based on role
      if (res.data.user.role === "admin") {
        navigate("/admin/users"); // <-- FIXED
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        {successMsg && <p className="success-message">{successMsg}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          {/* <button type="submit">Login</button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;
