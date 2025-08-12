import React from "react";
Link
import "./CryptoFiRoadmap.css";
import { Link } from "react-router-dom";

const CryptoFiRoadmap = () => {
  return (
    <div className="cryptoFi-landing">
      <section className="cryptoFi-hero">
        <div className="cryptoFi-hero-content">
          <h1>🚀 Welcome to CryptoFi</h1>
          <p>The Future of Passive Income with Arbitrum USDT 💸</p>
          <Link to="/">
            <a className="cryptoFi-cta">Get Started</a>
          </Link>
        </div>
      </section>

      <section className="cryptoFi-roadmap">
        <h2 className="cryptoFi-section-title">📍 How It Works</h2>
        <div className="cryptoFi-roadmap-grid">
          <div className="cryptoFi-card">
            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Wallet" />
            <h3>🔐 Create Account</h3>
            <p>Sign up and log in to get your personal Arbitrum USDT wallet instantly.</p>
          </div>

          <div className="cryptoFi-card">
            <img src="https://cdn-icons-png.flaticon.com/512/10415/10415331.png" alt="Deposit" />
            <h3>💼 Copy & Fund Wallet</h3>
            <p>Copy your wallet address and fund it to receive <strong>20% trading interest</strong> instantly.</p>
          </div>

          <div className="cryptoFi-card">
            <img src="https://cdn-icons-png.flaticon.com/512/9357/9357291.png" alt="Trading" />
            <h3>📈 Start Trading</h3>
            <p>Proceed to your dashboard and request a <strong>tutor or partner</strong> for massive profit.</p>
          </div>

          <div className="cryptoFi-card">
            <img src="https://cdn-icons-png.flaticon.com/512/6644/6644696.png" alt="Rewards" />
            <h3>🎁 Daily Rewards</h3>
            <p>Earn <strong>5 USDT Arbitrum daily</strong> when your wallet is funded.</p>
          </div>

          <div className="cryptoFi-card">
            <img src="https://cdn-icons-png.flaticon.com/512/9432/9432701.png" alt="Portfolio" />
            <h3>📊 Portfolio Tracker</h3>
            <p>Track your deposits, interest, and trading returns all in one dashboard — updated in real-time.</p>
          </div>

          <div className="cryptoFi-card">
            <img src="https://cdn-icons-png.flaticon.com/512/5356/5356780.png" alt="Security" />
            <h3>🛡️ Secure & Transparent</h3>
            <p>Built on Web3 standards — fully decentralized and secure. Your funds stay in your wallet, always.</p>
          </div>
        </div>
      </section>

      <footer className="cryptoFi-footer">
        <p>© {new Date().getFullYear()} CryptoFi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CryptoFiRoadmap;
