import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import "./Dashboard.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import arbitrum from "../../assets/arb.png";

const wallets = [
  { name: "MetaMask", icon: <img src="https://freelogopng.com/images/all_img/1683021055metamask-icon.png" alt="MetaMask" /> },
  { name: "Trust Wallet", icon: <img src="https://avatars.githubusercontent.com/u/32179889?s=280&v=4" alt="Trust Wallet" /> },
  { name: "Coinbase Wallet", icon: <img src="https://cdn.iconscout.com/icon/free/png-256/free-coinbase-9420774-7651204.png" alt="Coinbase Wallet" /> },
  { name: "WalletConnect", icon: <img src="https://images.seeklogo.com/logo-png/43/2/walletconnect-logo-png_seeklogo-430923.png" alt="WalletConnect" /> },
  { name: "SafePal", icon: <img src="https://play-lh.googleusercontent.com/uT6ByyNvUeLRMDnMKEC91RrbHftl2EBB58r9vZaNbiYf1F5Twa33_Hx0zYvEfCtiG1kE" alt="SafePal" /> },
  { name: "MathWallet", icon: <img src="https://play-lh.googleusercontent.com/7JhuwbTGFDaIdVj7LLyeOAvHyzxtx4zDOiQWuHOMP6T9ogijSzEBUhX3cK0q6LyMafQ" alt="MathWallet" /> },
];

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timePeriod, setTimePeriod] = useState("1D");
  const [balanceChartData, setBalanceChartData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [showBalanceNotice, setShowBalanceNotice] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); 

  const [selectedWallet, setSelectedWallet] = useState(null);

  const [showConnectNotice, setShowConnectNotice] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [copied, setCopied] = useState(false);

  const walletAddress = "0x6eca9a23a949d0050278703bee9aff5aaf53b2ab";

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetModal = () => {
    setIsModalOpen(false); 
    setSelectedCoin(null);
    setSelectedNetwork("");
    setCopied(false);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // const res = await axios.get("http://localhost:5000/api/auth/me", {
        const res = await axios.get(
          // "http://localhost:5000/api/auth/me",
          "https://investmentbackend-6m5g.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUsername(res.data.name);
        setBalance(res.data.balance);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserData();
  }, []);

  const [price, setPrice] = useState(3046.0);
  const [change, setChange] = useState(161.24);
  const [percentChange, setPercentChange] = useState(5.3);
  const [isPositive, setIsPositive] = useState(true);

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

  const sampleData = {
    labels: Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`),
    datasets: [
      {
        label: "Performance",
        data: [220, 250, 300, 280, 350, 400, 420, 410, 430, 480, 500, 562],
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const greedValue = 75;
  const greedChange = "+10.30%";

  const greedCircleData = {
    labels: ["Greed", "Remaining"],
    datasets: [
      {
        data: [greedValue, 100 - greedValue],
        backgroundColor: [`hsl(${greedValue}, 90%, 50%)`, "#1e293b"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const greedCircleOptions = {
    responsive: true,
    cutout: "70%",
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    animation: {
      animateRotate: true,
      duration: 1000,
    },
  };

  const getRandomValue = (base, variance) =>
    base + (Math.random() - 0.5) * variance;

  const generateData = () => ({
    "1D": Array.from({ length: 24 }, (_, i) => ({
      date: new Date(2024, 6, 30, i),
      value: getRandomValue(10000, 1000),
    })),
    "1W": Array.from({ length: 7 }, (_, i) => ({
      date: new Date(2024, 6, 24 + i),
      value: getRandomValue(9500, 1500),
    })),
    "1M": Array.from({ length: 30 }, (_, i) => ({
      date: new Date(2024, 6, i + 1),
      value: getRandomValue(9000, 2000),
    })),
    "1Y": Array.from({ length: 12 }, (_, i) => ({
      date: new Date(2024, i, 1),
      value: getRandomValue(8000, 3000),
    })),
    ALL: Array.from({ length: 5 }, (_, i) => ({
      date: new Date(2020 + i, 0, 1),
      value: getRandomValue(5000, 6000),
    })),
  });

  useEffect(() => {
    setBalanceChartData(generateData());
  }, []);

  useEffect(() => {
    if (balanceChartData[timePeriod]) {
      drawBalanceChart(balanceChartData[timePeriod]);
    }
  }, [balanceChartData, timePeriod]);

  const drawBalanceChart = (data) => {
    const containerEl = document.getElementById("balanceChart");
    if (!containerEl) return;

    d3.select(containerEl).select("svg").remove();

    const containerWidth = containerEl.clientWidth;
    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const innerWidth = containerWidth - margin.left - margin.right;
    const innerHeight = Math.max(150, innerWidth * 0.35);

    const svg = d3
      .select(containerEl)
      .append("svg")
      .attr(
        "viewBox",
        `0 0 ${innerWidth + margin.left + margin.right} ${
          innerHeight + margin.top + margin.bottom
        }`
      )
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "auto")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.date))
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.value) * 0.95,
        d3.max(data, (d) => d.value) * 1.05,
      ])
      .range([innerHeight, 0]);

    const line = d3
      .line()
      .x((d) => x(d.date))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#9575cd")
      .attr("stroke-width", 2)
      .attr("d", line);

    svg
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5).tickSizeOuter(0));

    svg.append("g").call(d3.axisLeft(y).ticks(5).tickSizeOuter(0));
  };

  useEffect(() => {
    const container = document.getElementById("balanceChart");
    if (!container) return;

    // initial draw if data ready
    if (balanceChartData[timePeriod]) {
      drawBalanceChart(balanceChartData[timePeriod]);
    }

    let timeoutId = null;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (balanceChartData[timePeriod]) {
          drawBalanceChart(balanceChartData[timePeriod]);
        }
      }, 100); 
    });

    resizeObserver.observe(container);
    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [balanceChartData, timePeriod]);

  return (
    <div className="dashboard-root">
      <header className="dashboard-header">
        <h1>CryptoFi</h1>
        <nav>
          <button className="tradingDashboardBtn">
            {balance > 0 ? (
              <Link to="/trading" className="trading-link">
                TRADING 📈
              </Link>
            ) : (
              <button
                className="trading-link disabled"
                onClick={() => setShowBalanceNotice(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: 0,
                }}
              >
                TRADING 📈
              </button>
            )}
          </button>
        </nav>
        <button
          className="connect-wallet-btn"
          onClick={() => setShowModal(true)}
        >
          Connect Wallet
        </button>
      </header>

      <div className="user-profile-card glass-card">
        <div className="avatar-wrapper">
          <img
            src="https://pbs.twimg.com/profile_images/1601973555536826370/q-xDKakh_400x400.jpg"
            alt="User Avatar"
            className="crypto-avatar"
          />
        </div>

        <div className="user-info-first">
          <div className="user-info">
            <h3 className="username">{username}.eth</h3>
            <p className="wallet-address">0x6ec..a9a2</p>
          </div>

          <div className="logout">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      <main>
        <div className="glass-card">
          <div className="dashboard-top">
            <div className="dashboard-container">
              <div className="dashboard-top-first">
                <h2>📊 Dashboard</h2>
                <button
                  onClick={() => {
                    if (!selectedWallet) {
                      setShowConnectNotice(true);
                      setShowModal(true);
                    } else {
                      setIsModalOpen(true);
                    }
                  }}
                >
                  💰 Deposit Crypto
                </button>
              </div>

              {isModalOpen && (
                <div className="modal-overlays">
                  <div className="modal-content glass-card">
                    <h3>💸 Choose a crypto to deposit</h3>
                    {selectedWallet && (
                      <p
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        🔐 Connected via{" "}
                        <span style={{ color: "#4ade80" }}>
                          {selectedWallet}
                        </span>
                      </p>
                    )}

                    {!selectedCoin ? (
                      <div className="coin-list">
                        <div
                          className="coin-item"
                          onClick={() => setSelectedCoin("USDT")}
                        >
                          <span className="emoji">💵</span>
                          <div>
                            <strong>USDT (Tether)</strong>
                            <p className="coin-desc">Stablecoin • ~$1.00</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="custom-dropdown">
                          {/* <label className="custom-dropdown-label">Select Network:</label> */}
                          <div
                            className="selected"
                            onClick={() => setShowDropdown(!showDropdown)}
                          >
                            {selectedNetwork === "Arbitrum One" && (
                              <img src={arbitrum} alt="Arbitrum" />
                            )}
                            {selectedNetwork || "Choose Network"}
                          </div>
                          {showDropdown && (
                            <ul>
                              <li
                                onClick={() => {
                                  setSelectedNetwork("Arbitrum One");
                                  setShowDropdown(false);
                                }}
                              >
                                <img src={arbitrum} alt="Arbitrum" /> Arbitrum
                                One
                              </li>
                            </ul>
                          )}
                        </div>

                        {selectedNetwork === "Arbitrum One" && (
                          <div className="wallet-details">
                            <p>
                              <strong>🔗 Wallet Address:</strong>
                            </p>
                            <code>{walletAddress}</code>
                            <p className="note">
                              ⚠️ Only send USDT via Arbitrum One.
                            </p>
                            <button
                              className="copy-button"
                              onClick={handleCopy}
                            >
                              {copied ? "✅ Copied!" : "📋 Copy Address"}
                            </button>
                          </div>
                        )}
                      </>
                    )}

                    <button className="close-button" onClick={resetModal}>
                      ❌ Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="time-selector">
              {["1D", "1W", "1M", "1Y", "ALL"].map((period) => (
                <button
                  key={period}
                  className={`time-btn ${
                    timePeriod === period ? "active" : ""
                  }`}
                  onClick={() => setTimePeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="balance-section">
              <div className="balance-summary">
                <div>
                  <h3>Total Assets</h3>
                  <p className="big-number">
                    ${balance.toLocaleString()} <span>USD</span>
                  </p>
                  <p className="positive-change">+$1,169.28 (12.4%)</p>
                </div>
                <div className="price-summary">
                  <h3>Last Traded Price</h3>
                  <p className="big-number">${price.toLocaleString()}</p>
                  <p
                    className={
                      isPositive ? "positive-change" : "negative-change"
                    }
                  >
                    {isPositive ? "+" : "-"}${change.toLocaleString()} (
                    {percentChange}%)
                  </p>
                </div>
              </div>
              <div id="balanceChart" className="chart-background"></div>
            </div>

            <div className="glass-card swap-card">
              <h3>Swap Tokens</h3>
              <form className="swap-form">
                <div className="form-group">
                  <label>From</label>
                  <select className="glass-select">
                    <option>ETH</option>
                    <option>USDT</option>
                    <option>BTC</option>
                  </select>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="glass-input"
                  />
                </div>

                <div className="form-group swap-icon">&#8646;</div>

                <div className="form-group">
                  <label>To</label>
                  <select className="glass-select">
                    <option>USDC</option>
                    <option>ETH</option>
                    <option>DAI</option>
                  </select>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="glass-input"
                  />
                </div>

                <button type="submit" className="glass-btn full-width">
                  Swap
                </button>
              </form>

              <div className="mini-chart-wrapper">
                <h4>ETH Price Trend</h4>
                <div id="miniLineChart" className="mini-chart"></div>
              </div>
            </div>

            {/* ... Swap section and modal code continues unchanged ... */}
          </div>
        </div>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="wallet-modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Select a Wallet</h2>
            <div className="wallet-grid">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="wallet-option"
                  onClick={() => {
                    setSelectedWallet(wallet.name);
                    setShowModal(false);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="wallet-icon">{wallet.icon}</div>
                  <span>{wallet.name}</span>
                </div>
              ))}
            </div>
            <button
              className="glass-btn close-btn"
              onClick={() => setShowModal(false)}
            >
              x
            </button>
          </div>
        </div>
      )}

      <div className="dashboard-cards">
        <div className="glass-card">
          <h3 className="card-title">Sales Statistic</h3>
          <p className="card-amount">
            $<span id="salesValue">1,062.56</span>
          </p>
          <p className="card-change text-green">
            Today (+<span id="salesChangePercent">40.8</span>%)
          </p>
          <div className="chart-wrapper">
            <Line data={sampleData} />
          </div>
        </div>

        <div className="glass-card">
          <h3 className="card-title">Exchange Offer</h3>
          <p className="card-amount">
            $<span id="exchangeValue">491.20</span>
          </p>
          <p className="card-change text-green">
            Today (+<span id="exchangeChangePercent">19.5</span>%)
          </p>
          <div className="chart-wrapper">
            <Line data={sampleData} />
          </div>
        </div>

        <div className="glass-card greed-card">
          <h3 className="card-title">Greed Index</h3>
          <div className="greed-doughnut-wrapper">
            <Doughnut data={greedCircleData} options={greedCircleOptions} />
            <div className="greed-center">
              <span className="index-value">{greedValue}%</span>
              <span className="card-change text-green">{greedChange}</span>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}

      {showConnectNotice && (
        <div
          className="modal-overlay"
          onClick={() => setShowConnectNotice(false)}
        >
          <div
            className="wallet-modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#f87171" }}>🚫 Wallet Not Connected</h3>
            <p style={{ marginTop: "10px" }}>
              Please connect a wallet before trying to deposit crypto.
            </p>
            <button
              className="glass-btn"
              style={{ marginTop: "20px" }}
              onClick={() => setShowConnectNotice(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {showBalanceNotice && (
        <div
          className="modal-overlay"
          onClick={() => setShowBalanceNotice(false)}
        >
          <div
            className="wallet-modal glass-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ color: "#f87171" }}>🚫 Trading Unavailable</h3>
            <p style={{ marginTop: "10px" }}>
              Your balance is currently <strong>$0</strong>. Please deposit
              funds before accessing the trading feature.
            </p>
            <button
              className="glass-btn"
              style={{ marginTop: "20px" }}
              onClick={() => setShowBalanceNotice(false)}
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* ... Cards and Modal continue unchanged ... */}
    </div>
  );
};

export default Dashboard;
