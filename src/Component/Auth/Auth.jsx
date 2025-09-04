import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Auth = () => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      if (type === "login") {
        const res = await axios.post(
          "https://investmentbackend-6m5g.onrender.com/api/auth/login",
          { email: form.email, password: form.password }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setSuccessMsg(res.data.message || "Login successful.");

        setLoading(false);

        if (res.data.user.role === "admin") {
          navigate("/admin/users");
        } else {
          navigate("/dashboard");
        }
      } else if (type === "register") {
        const res = await axios.post(
          "https://investmentbackend-6m5g.onrender.com/api/auth/register",
          form
        );

        setSuccessMsg(res.data.message || "Registration successful. Check your mail.");
        setLoading(false);

        // Switch back to login after successful registration
        setTimeout(() => {
          setIsSignUpMode(false);
        }, 2500);
      }
    } catch (err) {
      alert(err.response?.data?.message || `${type} failed`);
      setLoading(false);
    }
  };

  return (
    <div className={`auth-container ${isSignUpMode ? "auth-sign-up-mode" : ""}`}>
      <div className="auth-forms-container">
        <div className="auth-signin-signup">
          {/* Login */}
          <form className="auth-sign-in-form" onSubmit={(e) => handleSubmit(e, "login")}>
            <h2 className="auth-title">Sign in</h2>
            {successMsg && !isSignUpMode && <p className="success-message">{successMsg}</p>}
            <div className="auth-input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn auth-solid" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <form className="auth-sign-up-form" onSubmit={(e) => handleSubmit(e, "register")}>
            <h2 className="auth-title">Sign up</h2>
            {successMsg && isSignUpMode && <p className="success-message">{successMsg}</p>}
            <div className="auth-input-field">
              <i className="fas fa-user"></i>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth-input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Registering..." : "Sign up"}
            </button>
          </form>
        </div>
      </div>

      {/* Panels */}
      <div className="auth-panels-container">
        <div className="auth-panel auth-left-panel">
          <div className="auth-content">
            <h3>New here ?</h3>
            <p>Create an account and start your journey with us</p>
            <button
              type="button"
              className="auth-btn auth-transparent"
              onClick={() => setIsSignUpMode(true)}
            >
              Sign up
            </button>
          </div>
          <img
            src="https://i.ibb.co/6HXL6q1/Privacy-policy-rafiki.png"
            className="auth-image"
            alt="Privacy policy illustration"
          />
        </div>
        <div className="auth-panel auth-right-panel">
          <div className="auth-content">
            <h3>One of us ?</h3>
            <p>Already have an account? Sign in to continue.</p>
            <button
              type="button"
              className="auth-btn auth-transparent"
              onClick={() => setIsSignUpMode(false)}
            >
              Sign in
            </button>
          </div>
          <img
            src="https://i.ibb.co/nP8H853/Mobile-login-rafiki.png"
            className="auth-image"
            alt="Mobile login illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default Auth;
