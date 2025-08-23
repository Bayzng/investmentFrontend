import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Trading.css";
import TradingViewWidget from "../TradingViewWidget/TradingViewWidget";

const formatMoney = (n) =>
  "$" +
  Number(n).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function Trading() {
  const [username, setUsername] = useState("");
  const [price, setPrice] = useState(3046.0);
  const [change, setChange] = useState(161.24);
  const [balance, setBalance] = useState(0);
  const [isPositive, setIsPositive] = useState(true);
  const [percentChange, setPercentChange] = useState(5.3);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeModalMessage, setTradeModalMessage] = useState("");

  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradeDelay, setTradeDelay] = useState(5);
  const [transactions, setTransactions] = useState([]);
  const timersRef = useRef({});

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          "https://investmentbackend-6m5g.onrender.com/api/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsername(res.data.name);
        setBalance(res.data.balance ?? 1000);
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (!username) return;

    const fetchTrades = async () => {
      try {
        const res = await axios.get(
          `https://investmentbackend-6m5g.onrender.com/api/trades/user/${username}`
        );
        setTransactions(res.data);
      } catch (err) {
        console.error(
          "Error fetching trades:",
          err.response?.data || err.message
        );
      }
    };

    fetchTrades();
  }, [username]);

  // Price fluctuation simulator
  useEffect(() => {
    const interval = setInterval(() => {
      const fluctuation = (Math.random() - 0.5) * 100;
      const newPrice = parseFloat((price + fluctuation).toFixed(2));
      const newChange = parseFloat(Math.abs(fluctuation).toFixed(2));
      const newPercent = parseFloat(
        ((newChange / Math.max(newPrice, 1)) * 100).toFixed(2)
      );

      setPrice(newPrice);
      setChange(newChange);
      setPercentChange(newPercent);
      setIsPositive(fluctuation >= 0);
    }, 5000);

    return () => clearInterval(interval);
  }, [price]);

  // Quick welcome modal
  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  // --- Place Trade ---
  const placeTrade = async () => {
    const amount = Number(tradeAmount);
    if (!amount || amount <= 0) return alert("Enter a valid trade amount");
    if (amount > balance) return alert("Insufficient balance for this trade");
    if (tradeDelay < 1) return alert("Trade delay must be at least 1 second");

    const userTrades = transactions.filter(
      (t) => t.status !== "cancelled"
    ).length;
    const maxTrades = balance >= 1000 ? 5 : 3;
    if (userTrades >= maxTrades)
      return alert(`❌ Trade limit reached! Max ${maxTrades} trades Daily.`);

    const now = new Date();
    const scheduledAt = new Date(now.getTime() + tradeDelay * 1000);

    const tempTx = {
      _id: "temp-" + Math.random(),
      amount,
      entryPrice: price,
      placedAt: now.toISOString(),
      scheduledAt: scheduledAt.toISOString(),
      status: "pending",
      note: "Scheduled",
    };

    // Optimistic UI update
    setTransactions((prev) => [tempTx, ...prev]);
    setBalance((b) => Number((b - amount).toFixed(2)));
    setTradeAmount(0);

    // Show Trade Modal
    setTradeModalMessage(
      "🚀 Trade is in progress... Tip: Keep calm and watch the market!"
    );
    setShowTradeModal(true);

    try {
      const res = await axios.post(
        "https://investmentbackend-6m5g.onrender.com/api/trades",
        {
          username,
          amount: tempTx.amount,
          entryPrice: tempTx.entryPrice,
          placedAt: tempTx.placedAt,
          scheduledAt: tempTx.scheduledAt,
          status: tempTx.status,
        }
      );

      const savedTx = res.data;

      // Replace temp transaction with saved backend transaction
      setTransactions((prev) =>
        prev.map((t) => (t._id === tempTx._id ? savedTx : t))
      );

      // Wait for tradeDelay seconds then execute trade and update modal
      setTimeout(async () => {
        await executeTrade(savedTx._id);
        setTradeModalMessage(
          "✅ Trade completed! Check your portfolio or transaction history below."
        );

        // Hide modal after 3 seconds and refresh page
        setTimeout(() => {
          setShowTradeModal(false);
          window.location.reload();
        }, 3000);
      }, tradeDelay * 1000);
    } catch (err) {
      console.error(
        "❌ Error saving trade:",
        err.response?.data || err.message
      );
      setBalance((b) => Number((b + amount).toFixed(2)));
      setTransactions((prev) => prev.filter((t) => t._id !== tempTx._id));
      setShowTradeModal(false);
    }
  };

  // --- Execute Trade ---
  // --- Execute Trade ---
// --- Execute Trade ---
const executeTrade = async (tradeId) => {
  // Get the latest transaction from state
  const tx = transactions.find((t) => t._id === tradeId);
  if (!tx || tx.status !== "pending") return;

  const success = Math.random() < 0.6; // 60% chance to succeed
  let pnl = 0,
    result = "failed",
    note = "";

  if (success) {
    const profitPct = (Math.random() * (10 - 0.5) + 0.5) / 100;
    pnl = parseFloat((tx.amount * profitPct).toFixed(2));
    result = "success";
    note = `Profit ${(profitPct * 100).toFixed(2)}%`;
  } else {
    const lossPct = (Math.random() * (50 - 0.5) + 0.5) / 100;
    pnl = -parseFloat((tx.amount * lossPct).toFixed(2));
    note = `Loss ${Math.abs(lossPct * 100).toFixed(2)}%`;
  }

  try {
    // Update balance safely using callback form
    setBalance((prevBalance) => {
      if (success) {
        // Add back the staked amount + pnl only on success
        return parseFloat((prevBalance + tx.amount + pnl).toFixed(2));
      }
      // On failure, the staked amount is lost, no change needed
      return prevBalance;
    });

    const res = await axios.put(
      `https://investmentbackend-6m5g.onrender.com/api/trades/${tradeId}`,
      {
        status: "executed",
        result,
        pnl,
        note,
        executedAt: new Date().toISOString(),
        balanceAfter: success
          ? parseFloat((balance + tx.amount + pnl).toFixed(2))
          : balance,
      }
    );

    setTransactions((prev) =>
      prev.map((t) => (t._id === tradeId ? res.data : t))
    );
  } catch (err) {
    console.error(
      "❌ Error updating trade:",
      err.response?.data || err.message
    );
  }

  delete timersRef.current[tradeId];
};


  // --- Cancel Pending Trade ---
  const cancelPending = async (id) => {
    try {
      const res = await axios.put(
        `https://investmentbackend-6m5g.onrender.com/api/trades/cancel/${id}`
      );
      setTransactions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setBalance(res.data.balanceAfter ?? balance);
    } catch (err) {
      console.error("Cancel trade error:", err.response?.data || err.message);
    }
  };

  const clearHistory = () => {
    if (!confirm("Clear transaction history? This cannot be undone.")) return;
    setTransactions([]);
  };

  const handleSendMail = async () => {
    try {
      const res = await axios.post(
        "https://investmentbackend-6m5g.onrender.com/api/send-mail",
        {
          subject: "Request for Trading Tutor or Partner",
          to: "crypto.cryptofi@gmail.com",
          message: `Hello CryptoFi Team,\n\nI would like to request a trading ${
            balance <= 0 ? "tutor" : "partner"
          } to assist me in maximizing my trading experience on the platform. Please provide me with guidance on how to proceed.\n\nThank you,\n${username}`,
        }
      );
      if (res.status === 200) {
        alert("✅ Email sent to crypto.cryptofi@gmail.com!");
        setShowRequestModal(false);
      } else {
        alert("❌ Failed to send email. Try again.");
      }
    } catch (error) {
      console.error("Mail send error:", error);
      alert("⚠️ Could not send email. Check your connection.");
    }
  };

  const TransactionRow = ({ tx }) => (
    <tr className={`tx-row ${tx.status}`}>
      <td>{tx._id}</td>
      <td>{new Date(tx.placedAt).toLocaleString()}</td>
      <td>{formatMoney(tx.amount)}</td>
      <td>{formatMoney(tx.entryPrice)}</td>
      <td>{tx.status}</td>
      <td>{tx.executedAt ? new Date(tx.executedAt).toLocaleString() : "-"}</td>
      <td style={{ color: tx.result === "failed" ? "red" : "green" }}>
        {tx.result || "-"}
      </td>
      <td>{tx.pnl ? formatMoney(tx.pnl) : "-"}</td>
      <td>{tx.note}</td>
      <td>
        {tx.status === "pending" && (
          <button className="btn small" onClick={() => cancelPending(tx._id)}>
            Cancel
          </button>
        )}
      </td>
    </tr>
  );

  return (
    <div className="trading-page">
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

      <div className="top-grid">
        {/* User Profile */}
        <div className="user-profile-card glass-card">
          <div className="avatar-wrapper">
            <img
              src="https://pbs.twimg.com/profile_images/1601973555536826370/q-xDKakh_400x400.jpg"
              alt="User Avatar"
              className="crypto-avatar"
            />
          </div>
          <div className="user-info">
            <h3 className="username">{username || "anon"}.eth</h3>
            <p className="wallet-address">0x6ec..a9a2</p>
          </div>
        </div>

        {/* Trading Asset */}
        <div className="trading-asset small-card">
          <h3>Total Assets</h3>
          <p className="big-number">
            {formatMoney(balance)} <span>USD</span>
          </p>
          <div className="price-summary">
            <h4>Last Traded Price</h4>
            <p className="big-number">{formatMoney(price)}</p>
            <p className={isPositive ? "positive-change" : "negative-change"}>
              {isPositive ? "+" : "-"}${change.toLocaleString()} (
              {percentChange}%)
            </p>
          </div>
        </div>

        {/* Trade Form */}
        <div className="trade-form-card small-card">
          <h3>Place Trade</h3>
          <label>Amount (USD)</label>
          <input
            type="number"
            value={tradeAmount}
            onChange={(e) => setTradeAmount(e.target.value)}
            placeholder="0.00"
          />
          <label>Execute after (seconds)</label>
          <input
            type="number"
            value={tradeDelay}
            onChange={(e) => setTradeDelay(Number(e.target.value))}
            min={1}
            max={3600}
          />
          <div style={{ marginTop: 8 }}>
            <button className="btn" onClick={placeTrade}>
              📤 Place Trade
            </button>
            <button
              className="btn ghost"
              style={{ marginLeft: 8 }}
              onClick={() => {
                setTradeAmount(0);
                setTradeDelay(5);
              }}
            >
              Reset
            </button>
          </div>
          <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            Trades are simulated. When executed, trades will randomly succeed or
            fail and update your balance and transaction history.
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-card card" style={{ height: 420 }}>
        <TradingViewWidget symbol="ETHUSDT" />
      </div>

      {/* Transaction History */}
      <div className="history-card card">
        <div className="history-header">
          <h3>Transaction History</h3>
          <div>
            <button className="btn ghost" onClick={clearHistory}>
              Clear History
            </button>
          </div>
        </div>
        <div className="history-table-wrap">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Placed</th>
                <th>Amount</th>
                <th>Entry Price</th>
                <th>Status</th>
                <th>Executed</th>
                <th>Result</th>
                <th>PnL</th>
                <th>Note</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: "center", padding: 20 }}>
                    No transactions yet. Place a trade to get started.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <TransactionRow key={tx._id} tx={tx} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Existing Modals */}
      {showModal && (
        <div
          className="tradingModal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="tradingModal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>👋 Welcome to CryptoFi Trading</h2>
            <p>🚀 Ready to level up your crypto journey?</p>
            <p>
              📈 CryptoFi offers <strong>higher returns</strong> through smart
              trading.
            </p>
            <p>
              💰 If your wallet isn’t funded yet, go back to the dashboard and
              deposit some crypto!
            </p>
            <p>
              ✨ Request a <strong>trading tutor</strong> or find a{" "}
              <strong>trading partner</strong> to start.
            </p>
            <button
              className="request-btn"
              onClick={() => setShowRequestModal(true)}
            >
              📩 Request Tutor/Partner
            </button>
          </div>
        </div>
      )}

      {showRequestModal && (
        <div
          className="tradingModal-overlay"
          onClick={() => setShowRequestModal(false)}
        >
          <div
            className="tradingModal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>📧 Your Email Draft</h3>
            <textarea
              readOnly
              defaultValue={`To: crypto.cryptofi@gmail.com\nSubject: Request for Trading Tutor or Partner\n\nHello CryptoFi Team,\n\nI would like to request a trading ${
                balance <= 0 ? "tutor" : "partner"
              } to assist me in improving my trading strategies and maximizing my potential in the market.\n\nThank you,\n${username}`}
            />
            <p>
              ✉️ Copy and send to{" "}
              <strong style={{ color: "#60a5fa" }}>
                crypto.cryptofi@gmail.com
              </strong>{" "}
              or click send below.
            </p>
            <button onClick={handleSendMail}>📤 Send Email</button>
            <button
              onClick={() => setShowRequestModal(false)}
              style={{ marginLeft: 10 }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Trade Progress Modal */}
      {showTradeModal && (
        <div className="notificationModal-overlay">
          <div className="notificationModal-content">
            <h2>{tradeModalMessage}</h2>
          </div>
        </div>
      )}
    </div>
  );
}



// here


// import React, { useEffect, useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import "./Trading.css";
// import TradingViewWidget from "../TradingViewWidget/TradingViewWidget";

// const formatMoney = (n) =>
//   "$" +
//   Number(n).toLocaleString(undefined, {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// export default function Trading() {
//   const [username, setUsername] = useState("");
//   const [price, setPrice] = useState(3046.0);
//   const [change, setChange] = useState(161.24);
//   const [balance, setBalance] = useState(0);
//   const [isPositive, setIsPositive] = useState(true);
//   const [percentChange, setPercentChange] = useState(5.3);
//   const [showModal, setShowModal] = useState(false);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [showTradeModal, setShowTradeModal] = useState(false);
//   const [tradeModalMessage, setTradeModalMessage] = useState("");

//   const [tradeAmount, setTradeAmount] = useState(0);
//   const [tradeDelay, setTradeDelay] = useState(5);
//   const [transactions, setTransactions] = useState([]);
//   const timersRef = useRef({});

//   // Fetch user data
//   useEffect(() => {
//     const fetchUserData = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       try {
//         const res = await axios.get(
//           "https://investmentbackend-6m5g.onrender.com/api/auth/me",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setUsername(res.data.name);
//         setBalance(res.data.balance ?? 1000);
//       } catch (error) {
//         console.error(
//           "Error fetching user data:",
//           error.response?.data || error.message
//         );
//       }
//     };
//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     if (!username) return;

//     const fetchTrades = async () => {
//       try {
//         const res = await axios.get(
//           `https://investmentbackend-6m5g.onrender.com/api/trades/user/${username}`
//         );
//         setTransactions(res.data);
//       } catch (err) {
//         console.error(
//           "Error fetching trades:",
//           err.response?.data || err.message
//         );
//       }
//     };

//     fetchTrades();
//   }, [username]);

//   // Price fluctuation simulator
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const fluctuation = (Math.random() - 0.5) * 100;
//       const newPrice = parseFloat((price + fluctuation).toFixed(2));
//       const newChange = parseFloat(Math.abs(fluctuation).toFixed(2));
//       const newPercent = parseFloat(
//         ((newChange / Math.max(newPrice, 1)) * 100).toFixed(2)
//       );

//       setPrice(newPrice);
//       setChange(newChange);
//       setPercentChange(newPercent);
//       setIsPositive(fluctuation >= 0);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [price]);

//   // Quick welcome modal
//   useEffect(() => {
//     const timer = setTimeout(() => setShowModal(true), 8000);
//     return () => clearTimeout(timer);
//   }, []);

//   // --- Place Trade ---
//   const placeTrade = async () => {
//     const amount = Number(tradeAmount);
//     if (!amount || amount <= 0) return alert("Enter a valid trade amount");
//     if (amount > balance) return alert("Insufficient balance for this trade");
//     if (tradeDelay < 1) return alert("Trade delay must be at least 1 second");

//     const userTrades = transactions.filter(
//       (t) => t.status !== "cancelled"
//     ).length;
//     const maxTrades = balance >= 1000 ? 5 : 3;
//     if (userTrades >= maxTrades)
//       return alert(`❌ Trade limit reached! Max ${maxTrades} trades Daily.`);

//     const now = new Date();
//     const scheduledAt = new Date(now.getTime() + tradeDelay * 1000);

//     const tempTx = {
//       _id: "temp-" + Math.random(),
//       amount,
//       entryPrice: price,
//       placedAt: now.toISOString(),
//       scheduledAt: scheduledAt.toISOString(),
//       status: "pending",
//       note: "Scheduled",
//     };

//     // Optimistic UI update
//     setTransactions((prev) => [tempTx, ...prev]);
//     setBalance((b) => Number((b - amount).toFixed(2)));
//     setTradeAmount(0);

//     // Show Trade Modal
//     setTradeModalMessage(
//       "🚀 Trade is in progress... Tip: Keep calm and watch the market!"
//     );
//     setShowTradeModal(true);

//     try {
//       const res = await axios.post(
//         "https://investmentbackend-6m5g.onrender.com/api/trades",
//         {
//           username,
//           amount: tempTx.amount,
//           entryPrice: tempTx.entryPrice,
//           placedAt: tempTx.placedAt,
//           scheduledAt: tempTx.scheduledAt,
//           status: tempTx.status,
//         }
//       );

//       const savedTx = res.data;

//       // Replace temp transaction with saved backend transaction
//       setTransactions((prev) =>
//         prev.map((t) => (t._id === tempTx._id ? savedTx : t))
//       );

//       // Wait for tradeDelay seconds then execute trade and update modal
//       setTimeout(async () => {
//         await executeTrade(savedTx._id);
//         setTradeModalMessage(
//           "✅ Trade completed! Check your portfolio or transaction history below."
//         );

//         // Hide modal after 3 seconds and refresh page
//         setTimeout(() => {
//           setShowTradeModal(false);
//           window.location.reload();
//         }, 3000);
//       }, tradeDelay * 1000);
//     } catch (err) {
//       console.error(
//         "❌ Error saving trade:",
//         err.response?.data || err.message
//       );
//       setBalance((b) => Number((b + amount).toFixed(2)));
//       setTransactions((prev) => prev.filter((t) => t._id !== tempTx._id));
//       setShowTradeModal(false);
//     }
//   };

//   // --- Execute Trade ---
//   const executeTrade = async (tradeId) => {
//     const tx = transactions.find((t) => t._id === tradeId);
//     if (!tx || tx.status !== "pending") return;

//     const success = Math.random() < 0.6;
//     let pnl = 0,
//       result = "failed",
//       note = "";

//     if (success) {
//       const profitPct = (Math.random() * (10 - 0.5) + 0.5) / 100;
//       pnl = parseFloat((tx.amount * profitPct).toFixed(2));
//       result = "success";
//       note = `Profit ${(profitPct * 100).toFixed(2)}%`;
//     } else {
//       const lossPct = (Math.random() * (50 - 0.5) + 0.5) / 100;
//       pnl = -parseFloat((tx.amount * lossPct).toFixed(2));
//       note = `Loss ${Math.abs(lossPct * 100).toFixed(2)}%`;
//     }

//     try {
//       const res = await axios.put(
//         `https://investmentbackend-6m5g.onrender.com/api/trades/${tradeId}`,
//         {
//           status: "executed",
//           result,
//           pnl,
//           note,
//           executedAt: new Date().toISOString(),
//           balanceAfter: parseFloat((balance + pnl).toFixed(2)),
//         }
//       );

//       setTransactions((prev) =>
//         prev.map((t) => (t._id === tradeId ? res.data : t))
//       );

//       setBalance((b) => parseFloat((b + pnl).toFixed(2)));
//     } catch (err) {
//       console.error(
//         "❌ Error updating trade:",
//         err.response?.data || err.message
//       );
//     }

//     delete timersRef.current[tradeId];
//   };

//   // --- Cancel Pending Trade ---
//   const cancelPending = async (id) => {
//     try {
//       const res = await axios.put(
//         `https://investmentbackend-6m5g.onrender.com/api/trades/cancel/${id}`
//       );
//       setTransactions((prev) => prev.map((t) => (t._id === id ? res.data : t)));
//       setBalance(res.data.balanceAfter ?? balance);
//     } catch (err) {
//       console.error("Cancel trade error:", err.response?.data || err.message);
//     }
//   };

//   const clearHistory = () => {
//     if (!confirm("Clear transaction history? This cannot be undone.")) return;
//     setTransactions([]);
//   };

//   const handleSendMail = async () => {
//     try {
//       const res = await axios.post(
//         "https://investmentbackend-6m5g.onrender.com/api/send-mail",
//         {
//           subject: "Request for Trading Tutor or Partner",
//           to: "crypto.cryptofi@gmail.com",
//           message: `Hello CryptoFi Team,\n\nI would like to request a trading ${
//             balance <= 0 ? "tutor" : "partner"
//           } to assist me in maximizing my trading experience on the platform. Please provide me with guidance on how to proceed.\n\nThank you,\n${username}`,
//         }
//       );
//       if (res.status === 200) {
//         alert("✅ Email sent to crypto.cryptofi@gmail.com!");
//         setShowRequestModal(false);
//       } else {
//         alert("❌ Failed to send email. Try again.");
//       }
//     } catch (error) {
//       console.error("Mail send error:", error);
//       alert("⚠️ Could not send email. Check your connection.");
//     }
//   };

//   const TransactionRow = ({ tx }) => (
//     <tr className={`tx-row ${tx.status}`}>
//       <td>{tx._id}</td>
//       <td>{new Date(tx.placedAt).toLocaleString()}</td>
//       <td>{formatMoney(tx.amount)}</td>
//       <td>{formatMoney(tx.entryPrice)}</td>
//       <td>{tx.status}</td>
//       <td>{tx.executedAt ? new Date(tx.executedAt).toLocaleString() : "-"}</td>
//       <td style={{ color: tx.result === "failed" ? "red" : "green" }}>
//         {tx.result || "-"}
//       </td>
//       <td>{tx.pnl ? formatMoney(tx.pnl) : "-"}</td>
//       <td>{tx.note}</td>
//       <td>
//         {tx.status === "pending" && (
//           <button className="btn small" onClick={() => cancelPending(tx._id)}>
//             Cancel
//           </button>
//         )}
//       </td>
//     </tr>
//   );

//   return (
//     <div className="trading-page">
//       <header className="dashboard-header">
//         <h1>CryptoFi</h1>
//         <nav>
//           <ul className="dashboard-nav trading">
//             <Link className="trading" to="/trading">
//               <a href="#">Trade Chart 📈</a>
//             </Link>
//           </ul>
//         </nav>
//       </header>

//       <div className="top-grid">
//         {/* User Profile */}
//         <div className="user-profile-card glass-card">
//           <div className="avatar-wrapper">
//             <img
//               src="https://pbs.twimg.com/profile_images/1601973555536826370/q-xDKakh_400x400.jpg"
//               alt="User Avatar"
//               className="crypto-avatar"
//             />
//           </div>
//           <div className="user-info">
//             <h3 className="username">{username || "anon"}.eth</h3>
//             <p className="wallet-address">0x6ec..a9a2</p>
//           </div>
//         </div>

//         {/* Trading Asset */}
//         <div className="trading-asset small-card">
//           <h3>Total Assets</h3>
//           <p className="big-number">
//             {formatMoney(balance)} <span>USD</span>
//           </p>
//           <div className="price-summary">
//             <h4>Last Traded Price</h4>
//             <p className="big-number">{formatMoney(price)}</p>
//             <p className={isPositive ? "positive-change" : "negative-change"}>
//               {isPositive ? "+" : "-"}${change.toLocaleString()} (
//               {percentChange}%)
//             </p>
//           </div>
//         </div>

//         {/* Trade Form */}
//         <div className="trade-form-card small-card">
//           <h3>Place Trade</h3>
//           <label>Amount (USD)</label>
//           <input
//             type="number"
//             value={tradeAmount}
//             onChange={(e) => setTradeAmount(e.target.value)}
//             placeholder="0.00"
//           />
//           <label>Execute after (seconds)</label>
//           <input
//             type="number"
//             value={tradeDelay}
//             onChange={(e) => setTradeDelay(Number(e.target.value))}
//             min={1}
//             max={3600}
//           />
//           <div style={{ marginTop: 8 }}>
//             <button className="btn" onClick={placeTrade}>
//               📤 Place Trade
//             </button>
//             <button
//               className="btn ghost"
//               style={{ marginLeft: 8 }}
//               onClick={() => {
//                 setTradeAmount(0);
//                 setTradeDelay(5);
//               }}
//             >
//               Reset
//             </button>
//           </div>
//           <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
//             Trades are simulated. When executed, trades will randomly succeed or
//             fail and update your balance and transaction history.
//           </p>
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="chart-card card" style={{ height: 420 }}>
//         <TradingViewWidget symbol="ETHUSDT" />
//       </div>

//       {/* Transaction History */}
//       <div className="history-card card">
//         <div className="history-header">
//           <h3>Transaction History</h3>
//           <div>
//             <button className="btn ghost" onClick={clearHistory}>
//               Clear History
//             </button>
//           </div>
//         </div>
//         <div className="history-table-wrap">
//           <table className="history-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Placed</th>
//                 <th>Amount</th>
//                 <th>Entry Price</th>
//                 <th>Status</th>
//                 <th>Executed</th>
//                 <th>Result</th>
//                 <th>PnL</th>
//                 <th>Note</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {transactions.length === 0 ? (
//                 <tr>
//                   <td colSpan={10} style={{ textAlign: "center", padding: 20 }}>
//                     No transactions yet. Place a trade to get started.
//                   </td>
//                 </tr>
//               ) : (
//                 transactions.map((tx) => (
//                   <TransactionRow key={tx._id} tx={tx} />
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Existing Modals */}
//       {showModal && (
//         <div
//           className="tradingModal-overlay"
//           onClick={() => setShowModal(false)}
//         >
//           <div
//             className="tradingModal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2>👋 Welcome to CryptoFi Trading</h2>
//             <p>🚀 Ready to level up your crypto journey?</p>
//             <p>
//               📈 CryptoFi offers <strong>higher returns</strong> through smart
//               trading.
//             </p>
//             <p>
//               💰 If your wallet isn’t funded yet, go back to the dashboard and
//               deposit some crypto!
//             </p>
//             <p>
//               ✨ Request a <strong>trading tutor</strong> or find a{" "}
//               <strong>trading partner</strong> to start.
//             </p>
//             <button
//               className="request-btn"
//               onClick={() => setShowRequestModal(true)}
//             >
//               📩 Request Tutor/Partner
//             </button>
//           </div>
//         </div>
//       )}

//       {showRequestModal && (
//         <div
//           className="tradingModal-overlay"
//           onClick={() => setShowRequestModal(false)}
//         >
//           <div
//             className="tradingModal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3>📧 Your Email Draft</h3>
//             <textarea
//               readOnly
//               defaultValue={`To: crypto.cryptofi@gmail.com\nSubject: Request for Trading Tutor or Partner\n\nHello CryptoFi Team,\n\nI would like to request a trading ${
//                 balance <= 0 ? "tutor" : "partner"
//               } to assist me in improving my trading strategies and maximizing my potential in the market.\n\nThank you,\n${username}`}
//             />
//             <p>
//               ✉️ Copy and send to{" "}
//               <strong style={{ color: "#60a5fa" }}>
//                 crypto.cryptofi@gmail.com
//               </strong>{" "}
//               or click send below.
//             </p>
//             <button onClick={handleSendMail}>📤 Send Email</button>
//             <button
//               onClick={() => setShowRequestModal(false)}
//               style={{ marginLeft: 10 }}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Trade Progress Modal */}
//       {showTradeModal && (
//         <div className="notificationModal-overlay">
//           <div className="notificationModal-content">
//             <h2>{tradeModalMessage}</h2>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
