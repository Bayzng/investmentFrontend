import React, { useState } from "react";
import axios from "axios";
import "./Register.css";
import Login from "../Login/Login";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      // const res = await axios.post("http://localhost:5000/api/auth/register", form);
      const res = await axios.post("https://investmentbackend-6m5g.onrender.com/api/auth/register", form);

      setSuccessMsg(res.data.message || "Registration successful. Check your mail.");

      setLoading(false);

      // Delay before showing login modal
      setTimeout(() => {
        setShowLogin(true);
      }, 2500); 

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed.");
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {!showLogin && (
        <div className="register-card">
          <h2 className="register-title">Create an Account</h2>

          {successMsg && <p className="success-message">{successMsg}</p>}

          <form onSubmit={handleSubmit} className="register-form">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
            />
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
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="login-link-text">
            Already have an account?
            <button className="login-link" onClick={() => setShowLogin(true)}>
              Login
            </button>
          </p>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-close" onClick={() => setShowLogin(false)}>
              X
            </p>
            <Login />
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
