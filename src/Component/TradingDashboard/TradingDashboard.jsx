import React from 'react';
import './TradingDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEuroSign, faYenSign, faShoppingCart, faFileInvoiceDollar, faStopCircle, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

const TradingDashboard = () => {
  return (
    <div className="trading-dashboard">
      <div className="market-overview">
        <MarketCard
          pair="BTC/USD"
          price="$42,850.20"
          change="+2.34%"
          changeType="positive"
          pathArea="M0 35 L20 32 L40 34 L60 28 L80 25 L100 22 L120 24 L140 20 L160 22 L180 18 L200 20 L200 50 L0 50 Z"
          pathLine="M0 35 L20 32 L40 34 L60 28 L80 25 L100 22 L120 24 L140 20 L160 22 L180 18 L200 20"
          rising
        />

        <MarketCard
          icon={faEuroSign}
          pair="EUR/USD"
          price="1.0924"
          change="-0.15%"
          changeType="negative"
          pathArea="M0 25 L20 28 L40 32 L60 29 L80 33 L100 35 L120 31 L140 34 L160 30 L180 33 L200 31 L200 50 L0 50 Z"
          pathLine="M0 25 L20 28 L40 32 L60 29 L80 33 L100 35 L120 31 L140 34 L160 30 L180 33 L200 31"
        />

        <MarketCard
          icon={faYenSign}
          pair="USD/JPY"
          price="148.92"
          change="+0.45%"
          changeType="positive"
          pathArea="M0 30 L20 28 L40 25 L60 29 L80 26 L100 23 L120 27 L140 24 L160 21 L180 25 L200 22 L200 50 L0 50 Z"
          pathLine="M0 30 L20 28 L40 25 L60 29 L80 26 L100 23 L120 27 L140 24 L160 21 L180 25 L200 22"
          rising
        />
      </div>

      <div className="main-chart">
        <div className="chart-header">
          <div className="chart-title">
            <h2>BTC/USD</h2>
            <span className="timeframe">4H Chart</span>
          </div>
          <div className="chart-controls">
            {['1H', '4H', '1D', '1W'].map((t, i) => (
              <button key={i} className={`time-btn ${t === '4H' ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="chart-container">
          <div className="chart-grid"></div>
          <div className="chart-y-axis">
            {['42,900', '42,800', '42,700', '42,600', '42,500'].map((v, i) => <span key={i}>{v}</span>)}
          </div>
          <div className="chart-x-axis">
            {['09:00', '10:00', '11:00', '12:00', '13:00'].map((v, i) => <span key={i}>{v}</span>)}
          </div>
          <div className="chart-line">
            <svg viewBox="0 0 1000 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: 'rgba(0,255,127,0.2)' }} />
                  <stop offset="100%" style={{ stopColor: 'rgba(0,255,127,0)' }} />
                </linearGradient>
              </defs>
              <path className="chart-area" d="M0 300 L100 280 L200 320 L300 260 L400 290 L500 240 L600 270 L700 220 L800 250 L900 200 L1000 230 L1000 400 L0 400 Z" />
              <path className="chart-stroke" d="M0 300 L100 280 L200 320 L300 260 L400 290 L500 240 L600 270 L700 220 L800 250 L900 200 L1000 230" />
              <g className="price-points">
                {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((cx, i) => (
                  <circle key={i} cx={cx} cy={300 - (i * 10)} r="4" />
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div className="trading-panel">
        <div className="order-types">
          <button className="order-btn active"><FontAwesomeIcon icon={faShoppingCart} /> Market</button>
          <button className="order-btn"><FontAwesomeIcon icon={faFileInvoiceDollar} /> Limit</button>
          <button className="order-btn"><FontAwesomeIcon icon={faStopCircle} /> Stop</button>
        </div>

        <div className="order-form">
          <div className="form-group">
            <label>Amount (BTC)</label>
            <div className="input-group">
              <input type="number" defaultValue="2" min="0" step="0.01" />
              <span className="max-btn">MAX</span>
            </div>
          </div>
          <div className="form-group">
            <label>Total (USD)</label>
            <div className="input-group">
              <input type="number" defaultValue="1" min="0" step="0.01" />
              <span className="currency">USD</span>
            </div>
          </div>
          <div className="action-buttons">
            <button className="buy-btn"><FontAwesomeIcon icon={faArrowUp} /> Buy BTC</button>
            <button className="sell-btn"><FontAwesomeIcon icon={faArrowDown} /> Sell BTC</button>
          </div>
        </div>
      </div>

      <div className="market-news">
        <h3>Market News</h3>
        <div className="news-list">
          <NewsItem time="14:30" impact="high" text="Federal Reserve maintains interest rates, signals potential cuts in 2025" />
          <NewsItem time="12:15" impact="medium" text="Bitcoin surpasses $42,000 as institutional demand grows" />
          <NewsItem time="10:45" impact="high" text="European markets react to latest ECB policy decision" />
        </div>
      </div>
    </div>
  );
};

const MarketCard = ({ icon, pair, price, change, changeType, pathArea, pathLine, rising }) => {
  return (
    <div className={`market-card ${rising ? 'rising' : 'falling'}`}>
      <div className="symbol">
        <FontAwesomeIcon icon={icon} />
        <span>{pair}</span>
      </div>
      <div className="price">
        <h3>{price}</h3>
        <span className={`change ${changeType}`}>{change}</span>
      </div>
      <div className="sparkline">
        <svg viewBox="0 0 200 50" preserveAspectRatio="none">
          <path className="area" d={pathArea}></path>
          <path className="line" d={pathLine}></path>
        </svg>
      </div>
    </div>
  );
};

const NewsItem = ({ time, impact, text }) => (
  <div className="news-item">
    <div className="news-header">
      <span className="news-time">{time}</span>
      <span className={`impact ${impact}`}>{impact.charAt(0).toUpperCase() + impact.slice(1)} Impact</span>
    </div>
    <p>{text}</p>
  </div>
);

export default TradingDashboard;
