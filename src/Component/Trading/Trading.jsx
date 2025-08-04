import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Trading.css";
import axios from "axios";

const Trading = () => {
  const [username, setUsername] = useState("");
  const [price, setPrice] = useState(3046.0);
  const [change, setChange] = useState(161.24);
  const [balance, setBalance] = useState(0);
  const [isPositive, setIsPositive] = useState(true);
  const [percentChange, setPercentChange] = useState(5.3);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleSendMail = async () => {
    try {
      // const res = await axios.post("http://localhost:5000/api/send-mail", {
      const res = await axios.post("https://investmentbackend-6m5g.onrender.com/api/send-mail", {
        subject: "Request for Trading Tutor or Partner",
        to: "ayofe70@gmail.com",
        message: `Hello CryptoFi Team,\n\nI would like to request a trading ${
          balance <= 0 ? "tutor" : "partner"
        } to assist me in maximizing my trading experience on the platform. Please provide me with guidance on how to proceed.\n\nThank you,\n${username}`,
      });
  
      if (res.status === 200) {
        alert("✅ Email sent to support@cryptofi.com!");
        setShowRequestModal(false);
      } else {
        alert("❌ Failed to send email. Try again.");
      }
    } catch (error) {
      console.error("Mail send error:", error);
      alert("⚠️ Could not send email. Check your connection.");
    }
  };
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 8000); // Show modal after 30 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 100;
      const newPrice = parseFloat((price + fluctuation).toFixed(2));
      const newChange = parseFloat(Math.abs(fluctuation).toFixed(2));
      const newPercent = parseFloat(((newChange / newPrice) * 100).toFixed(2));

      setPrice(newPrice);
      setChange(newChange);
      setPercentChange(newPercent);
      setIsPositive(fluctuation >= 0);
    }, 5000);

    return () => clearInterval(interval);
  }, [price]);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // const res = await axios.get("http://localhost:5000/api/auth/me", {
        const res = await axios.get("https://investmentbackend-6m5g.onrender.com/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(res.data.name);
        setBalance(res.data.balance);
      } catch (error) {
        console.error("Error fetching user data:", error.response?.data || error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        container_id: "tv_chart_container",
        symbol: "AAPL",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#808080",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: true,
        width: "100%",
        height: "600",
      });
    };
    document.body.appendChild(script);
  }, []);

  const mailDraft = `
To: support@cryptofi.com
Subject: Request for Trading Tutor or Partner

Hello CryptoFi Team,

I would like to request a trading ${balance <= 0 ? "tutor" : "partner"} to assist me in maximizing my trading experience on the platform. Please provide me with guidance on how to proceed.

Thank you,
${username}
  `.trim();

  return (
    <div>
      <header className="dashboard-header">
        <h1>CryptoFi</h1>
        <nav>
          <ul className="dashboard-nav trading">
            <Link className="trading" to="/trading">
              <a href="#">Trade Chart 📈</a>
            </Link>
          </ul>
        </nav>
      </header>

      <div className="user-profile-card glass-card">
        <div className="avatar-wrapper">
          <img
            src="https://pbs.twimg.com/profile_images/1601973555536826370/q-xDKakh_400x400.jpg"
            alt="User Avatar"
            className="crypto-avatar"
          />
        </div>

        <div className="user-info">
          <h3 className="username">{username}.eth</h3>
          <p className="wallet-address">0x3f7d...E92F</p>
        </div>
      </div>

      <div className="trading-asset">
        <div>
          <h3>Total Assets</h3>
          <p className="big-number">
            ${balance.toLocaleString()} <span>USD</span>
          </p>
        </div>
        <div>
          <div className="price-summary">
            <h3>Last Traded Price</h3>
            <p className="big-number">${price.toLocaleString()}</p>
            <p className={isPositive ? "positive-change" : "negative-change"}>
              {isPositive ? "+" : "-"}${change.toLocaleString()} ({percentChange}%)
            </p>
          </div>
        </div>
      </div>

      <div id="tv_chart_container" />

      {showModal && (
  <div className="tradingModal-overlay" onClick={() => setShowModal(false)}>
    <div className="tradingModal-content" onClick={(e) => e.stopPropagation()}>
      <h2>👋 Welcome to CryptoFi Trading</h2>
      <p>🚀 Ready to level up your crypto journey?</p>
      <p>
        📈 CryptoFi offers <strong>higher returns</strong> through smart trading.
      </p>
      <p>
        💰 If your wallet isn’t funded yet, go back to the dashboard, copy your
        wallet address, and deposit some crypto to begin!
      </p>
      <p>
        ✨ You will need to Request for a <strong>trading tutor</strong> or find a{" "}
        <strong>trading partner</strong> to start with.
      </p>
      <button className="request-btn" onClick={() => setShowRequestModal(true)}>
        📩 Request Tutor/Partner
      </button>
    </div>
  </div>
)}

{showRequestModal && (
  <div className="tradingModal-overlay" onClick={() => setShowRequestModal(false)}>
    <div className="tradingModal-content" onClick={(e) => e.stopPropagation()}>
      <h3>📧 Your Email Draft</h3>
      <textarea readOnly defaultValue={mailDraft} />
      <p>
        ✉️ Copy and send to{" "}
        <strong style={{ color: "#60a5fa" }}>support@cryptofi.com</strong> or click send below.
      </p>
      <button onClick={handleSendMail}>📤 Send Email</button>
      <button onClick={() => setShowRequestModal(false)} style={{ marginLeft: "10px" }}>
        Close
      </button>
    </div>
  </div>
)}


    </div>
  );
};

export default Trading;
