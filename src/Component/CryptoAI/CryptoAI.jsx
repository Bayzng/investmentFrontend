import React from "react";
import { Link } from "react-router-dom";
import "./CryptoAI.css";

const CryptoAI = () => {
  return (
    <div className="cryptofi-container">
      {/* Header */}
      <header className="cryptofi-header">
        <h1>🤖 CryptoFi AI</h1>
        <nav>
          <ul>
            <li><a>AI Signals</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="cryptofi-hero">
        <h2>Smarter Crypto Trading Starts Here 💡</h2>
        <p>Let AI work for you. Make faster, smarter, emotion-free trading decisions — and earn while you sleep 😴</p>
        <Link to="/"><button>Get Started 🚀</button></Link>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="cryptofi-section">
        <h3>🔥 Why Choose CryptoFi AI?</h3>
        <ul>
          <li>⚡ Real-time AI Trading Signals</li>
          <li>💰 Earn Interest Daily on Your Crypto</li>
          <li>🧠 Automated Smart Trading — no experience needed!</li>
          <li>📊 Transparent analytics and performance tracking</li>
        </ul>
      </section>

      {/* Features Section */}
      <section id="features" className="cryptofi-section feature-highlight">
        <h3>📈 Trade & Earn — Effortlessly</h3>
        <div className="feature-grid">
          <div className="feature-card">
            <h4>📊 Smart Trading</h4>
            <p>AI-powered trading decisions that maximize your profit and reduce risk — all in real-time.</p>
          </div>
          <div className="feature-card">
            <h4>💵 Interest Accumulation</h4>
            <p>Stake your crypto and earn interest up to <strong>18% APY</strong>. Compounded and paid daily.</p>
          </div>
          <div className="feature-card">
            <h4>🔒 Risk Management</h4>
            <p>Set stop-loss, take-profit, and AI will manage your capital safely based on market movement.</p>
          </div>
        </div>
      </section>

      {/* AI Signals Section */}
      <section id="signals" className="cryptofi-section signals">
        <h3>📡 AI Trading Signals — Your Crypto GPS 🧭</h3>
        <p>Receive accurate buy/sell alerts 📲 before the market moves — tested and optimized with live data feeds.</p>
        <div className="signal-example">
          <div className="signal-box buy">🟢 Buy Signal: BTC @ $28,430</div>
          <div className="signal-box sell">🔴 Sell Signal: ETH @ $1,942</div>
        </div>
        <button>Signal 📬</button>
      </section>

      {/* Footer */}
      <footer className="cryptofi-footer">
        <p>🚀 Powered by CryptoFi AI — Smarter Trading, Bigger Gains © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default CryptoAI;
