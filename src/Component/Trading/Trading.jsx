// Trading.js
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Trading.css";
import TradingViewWidget from "../TradingViewWidget/TradingViewWidget";

const API_BASE = "https://investmentbackend-6m5g.onrender.com";

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

  // ONLY show result modal on executed success/fail
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultType, setResultType] = useState(""); // 'success' | 'failed' | ''

  // Withdraw modal + wallet/amount state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawError, setWithdrawError] = useState("");

  // Trade state
  const [tradeAmount, setTradeAmount] = useState(0);
  const [tradeDelay, setTradeDelay] = useState(5);
  const [transactions, setTransactions] = useState([]);

  // NEW: Trade in progress modal
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Refs to ensure we notify exactly once per executed trade
  // hydrate from localStorage so notifications survive refresh
  const notifiedIdsRef = useRef(
    new Set(JSON.parse(localStorage.getItem("notifiedTradeIds") || "[]"))
  );
  const prevTxRef = useRef([]);
  // firstLoadRef prevents showing modals for already-executed trades when the page first loads
  const firstLoadRef = useRef(true);

  const handleCloseResultModal = () => {
    setShowResultModal(false);
    setResultMessage("");
    setResultType("");
    // we DO NOT remove the notified id here — it's already stored when the modal was shown.
  };

  // Helpers
  const getToken = () => localStorage.getItem("token");

  const refreshUser = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const res = await axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res?.data) {
        setUsername(res.data.name || "");
        if (typeof res.data.balance === "number") {
          setBalance(res.data.balance);
        }
      }
    } catch (e) {
      console.error("refreshUser error:", e.response?.data || e.message);
    }
  };

  const persistNotifiedIds = () => {
    localStorage.setItem(
      "notifiedTradeIds",
      JSON.stringify([...notifiedIdsRef.current])
    );
  };

  const fetchTrades = async (u) => {
    if (!u) return;
    try {
      const res = await axios.get(`${API_BASE}/api/trades/user/${u}`);
      const trades = Array.isArray(res.data) ? res.data : [];

      // If this is the first load, set the prev snapshot and DON'T notify for already-executed trades.
      if (firstLoadRef.current) {
        setTransactions(trades);
        prevTxRef.current = trades;
        firstLoadRef.current = false;
        return;
      }

      // Build map of previous statuses by id to detect status transitions
      const prevById = Object.fromEntries(
        (prevTxRef.current || []).map((t) => [t._id, t])
      );

      // Find trades that just transitioned to "executed" and haven't been notified yet
      const newlyExecuted = trades.filter((t) => {
        const was = prevById[t._id];
        const justExecuted =
          t.status === "executed" && (!was || was.status !== "executed");
        const notNotified = !notifiedIdsRef.current.has(t._id);
        return justExecuted && notNotified;
      });

      if (newlyExecuted.length > 0) {
        // Pick the most recent executed trade (by executedAt, fallback to placedAt)
        const pickLatest = (arr) =>
          [...arr].sort((a, b) => {
            const ta =
              new Date(a.executedAt || a.updatedAt || a.placedAt).getTime() ||
              0;
            const tb =
              new Date(b.executedAt || b.updatedAt || b.placedAt).getTime() ||
              0;
            return tb - ta;
          })[0];

        const latest = pickLatest(newlyExecuted);
        // keep the detailed message (so users see pnl)
        const msg =
          latest.result === "success"
            ? `✅ Trade Success! You earned ${formatMoney(latest.pnl)}`
            : `❌ Trade Failed! You lost ${formatMoney(Math.abs(latest.pnl))}`;

        // set both the message and the result type
        setResultMessage(msg);
        setResultType(latest.result === "success" ? "success" : "failed");
        setShowResultModal(true);

        // mark notified so we don't show again — persist to localStorage
        notifiedIdsRef.current.add(latest._id);
        persistNotifiedIds();
      }

      setTransactions(trades);
      prevTxRef.current = trades;
    } catch (err) {
      console.error(
        "Error fetching trades:",
        err.response?.data || err.message
      );
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  // --- Fetch user's trades when username available + poll every 5s ---
  useEffect(() => {
    if (!username) return;
    // initial fetch (firstLoadRef ensures we don't notify for existing executed trades)
    fetchTrades(username);

    const interval = setInterval(async () => {
      await fetchTrades(username);
      await refreshUser(); // keep balance in sync with backend executions
    }, 5000);

    return () => clearInterval(interval);
  }, [username]);

  // Price fluctuation simulator (keeps UI lively)
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

  // --- Helper: today's trades count (placedAt) ---
  const todaysTradesCount = () => {
    const today = new Date().toDateString();
    return transactions.filter(
      (t) =>
        t.status !== "cancelled" &&
        new Date(t.placedAt).toDateString() === today
    ).length;
  };

  const maxTrades = balance >= 1000 ? 5 : 3;
  const todaysCount = todaysTradesCount();
  const tradesLeft = Math.max(0, maxTrades - todaysCount);

  // --- Place Trade (with daily limit check) ---
  const placeTrade = async () => {
    const amount = Number(tradeAmount);
    if (!amount || amount <= 0) return alert("Enter a valid trade amount");
    if (amount > balance) return alert("Insufficient balance for this trade");
    if (tradeDelay < 1) return alert("Trade delay must be at least 1 second");

    // Recompute today's trades in case state changed
    const todays = todaysTradesCount();
    if (todays >= maxTrades) {
      return alert(`❌ Trade limit reached! Max ${maxTrades} trades per day.`);
    }

    const now = new Date();
    const scheduledAt = new Date(now.getTime() + tradeDelay * 1000);

    const tempTx = {
      _id: "temp-" + Math.random().toString(36).slice(2),
      amount,
      entryPrice: price,
      placedAt: now.toISOString(),
      scheduledAt: scheduledAt.toISOString(),
      status: "pending",
      note: "Scheduled",
    };

    // Optimistic UI update (stake deducted immediately)
    setTransactions((prev) => [tempTx, ...prev]);
    setBalance((b) => Number((b - amount).toFixed(2)));
    setTradeAmount(0);

    // Show "Trade in Progress..." modal for ~2s
    setShowProgressModal(true);
    setTimeout(() => setShowProgressModal(false), 2000);

    // Send to backend
    try {
      const res = await axios.post(`${API_BASE}/api/trades`, {
        username,
        amount: tempTx.amount,
        entryPrice: tempTx.entryPrice,
        placedAt: tempTx.placedAt,
        scheduledAt: tempTx.scheduledAt,
        status: tempTx.status,
      });

      // Support both shapes: { trade, balance } OR just trade
      const savedTx = res?.data?.trade || res?.data || {};
      setTransactions((prev) =>
        prev.map((t) => (t._id === tempTx._id ? savedTx : t))
      );

      if (typeof res?.data?.balance === "number") {
        setBalance(res.data.balance);
      } else if (typeof savedTx?.balanceAfter === "number") {
        setBalance(savedTx.balanceAfter);
      } else {
        // Fallback: refetch user to ensure balance is accurate
        await refreshUser();
      }
    } catch (err) {
      console.error(
        "❌ Error saving trade:",
        err.response?.data || err.message
      );
      // rollback optimistic update
      setBalance((b) => Number((b + amount).toFixed(2)));
      setTransactions((prev) => prev.filter((t) => t._id !== tempTx._id));
    }
  };

  // --- Cancel Pending Trade ---
  const cancelPending = async (id) => {
    try {
      const res = await axios.put(`${API_BASE}/api/trades/cancel/${id}`);
      // backend returns the updated trade; balance is updated server-side
      const updatedTrade = res.data;
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? updatedTrade : t))
      );
      await refreshUser(); // ensure balance reflects refunded stake
    } catch (err) {
      console.error("Cancel trade error:", err.response?.data || err.message);
    }
  };

  const clearHistory = () => {
    if (!confirm("Clear transaction history? This cannot be undone.")) return;
    setTransactions([]);
    // NOTE: we intentionally do NOT clear notifiedTradeIds here so already-notified
    // executed trades won't re-notify on the next fetch. If you want clearing history
    // to also reset notifications, add:
    // notifiedIdsRef.current.clear();
    // persistNotifiedIds();
  };

  const handleSendMail = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/send-mail`, {
        subject: "Request for Trading Tutor or Partner",
        to: "crypto.cryptofi@gmail.com",
        message: `Hello CryptoFi Team,\n\nI would like to request a trading ${
          balance <= 0 ? "tutor" : "partner"
        } to assist me in maximizing my trading experience on the platform. Please provide me with guidance on how to proceed.\n\nThank you,\n${username}`,
      });
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

  // --- Withdraw amount input validation (live) ---
  const onWithdrawAmountChange = (e) => {
    const val = e.target.value;
    setWithdrawAmount(val);
    const num = Number(val);
    if (val === "") {
      setWithdrawError("");
      return;
    }
    if (!Number.isFinite(num) || num <= 0) {
      setWithdrawError("Enter a valid amount.");
    } else if (num > balance) {
      setWithdrawError("Amount cannot exceed your balance.");
    } else {
      setWithdrawError("");
    }
  };

  // --- handle withdraw submit (sends wallet + amount to crypto.cryptofi@gmail.com) ---
  const handleWithdrawSubmit = async () => {
    const amount = Number(withdrawAmount);

    if (!walletAddress || walletAddress.trim().length < 8) {
      return alert("⚠️ Please enter a valid Celo USDT wallet address.");
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return alert("⚠️ Enter a valid withdrawal amount.");
    }
    if (amount > balance) {
      return alert("❌ Withdrawal amount cannot exceed your balance.");
    }

    try {
      const res = await axios.post(`${API_BASE}/api/send-mail`, {
        subject: "Withdrawal Request",
        to: "crypto.cryptofi@gmail.com",
        message: `Hello CryptoFi Team,\n\nI would like to request a withdrawal.\n\nWallet Address (Celo USDT): ${walletAddress}\nAmount: ${formatMoney(
          amount
        )}\n\nNote: Withdrawal is only supported via Celo USDT.\n\nThanks,\n${username}`,
      });

      if (res.status === 200) {
        alert("✅ Withdrawal request sent to crypto.cryptofi@gmail.com!");
        setWalletAddress("");
        setWithdrawAmount("");
        setWithdrawError("");
        setShowWithdrawModal(false);
      } else {
        alert("❌ Failed to send withdrawal request. Try again later.");
      }
    } catch (err) {
      console.error(
        "Withdrawal mail error:",
        err.response?.data || err.message || err
      );
      alert("⚠️ Could not send withdrawal request. Check your connection.");
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
      <td>
        {typeof tx.pnl === "number" && tx.pnl !== 0 ? formatMoney(tx.pnl) : "-"}
      </td>
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
          <div className="WithdrawAssets">
            <button onClick={() => setShowWithdrawModal(true)}>
              Withdraw Assets
            </button>
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
            <button
              className="btn"
              onClick={placeTrade}
              disabled={
                Number(tradeAmount) <= 0 ||
                Number(tradeAmount) > balance ||
                todaysCount >= maxTrades
              }
            >
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

          <p style={{ marginTop: 10, fontSize: 13, color: "#666" }}>
            {todaysCount >= maxTrades ? (
              <strong style={{ color: "#c44" }}>
                Daily limit reached ({maxTrades}/{maxTrades}). Come back
                tomorrow.
              </strong>
            ) : (
              <>
                You have <strong>{tradesLeft}</strong> of{" "}
                <strong>{maxTrades}</strong> trades left today.
              </>
            )}
          </p>

          <p style={{ marginTop: 10, fontSize: 12, color: "#666" }}>
            Trades are executed in real time based on live market conditions. 
            When you place a trade, your profit or loss 
            is determined by actual price movements.
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

      {/* Welcome Modal */}
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

      {/* Request Modal */}
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

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div
          className="withdrawModal-overlay"
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            className="withdrawModal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="withdraw-top">
              <h2>💸 Withdraw Assets</h2>
              <p className="withdraw-sub">
                Please provide your <strong>Celo USDT</strong> wallet address
                and the amount to withdraw. Withdrawals are processed only via{" "}
                <strong>Celo USDT</strong>.
              </p>
            </div>

            <label className="input-label">Celo USDT Wallet Address</label>
            <input
              className="withdraw-input"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="e.g. 0x1234... (Celo USDT)"
            />

            <label className="input-label">Amount (USD)</label>
            <input
              className="withdraw-input"
              type="number"
              inputMode="decimal"
              value={withdrawAmount}
              onChange={onWithdrawAmountChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              max={balance}
            />
            {withdrawError && <p className="withdraw-error">{withdrawError}</p>}

            <p className="withdraw-note">
              <strong>Note:</strong> Ensure this is a CELO USDT-compatible
              address. Incorrect addresses may lead to irreversible loss.
              Available balance: <address>{formatMoney(balance)}</address>
            </p>

            <div className="withdraw-actions">
              <button
                className="btn"
                onClick={handleWithdrawSubmit}
                disabled={
                  !walletAddress ||
                  !withdrawAmount ||
                  !!withdrawError ||
                  Number(withdrawAmount) <= 0
                }
              >
                Submit Withdrawal
              </button>

              <button
                className="btn ghost"
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                  setWithdrawError("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Modal (NEW) */}
      {showProgressModal && (
        <div className="notificationModal-overlay">
          <div className="notificationModal-content">
            <h2>⏳ Trade in Progress...</h2>
            <p>
              Your trade is being processed. Please wait a moment — don't
              refresh or close the page.
            </p>
            <ul>
              <li>✅ Please wait a few seconds</li>
              <li>⚡ Do not refresh or close this page</li>
              <li>📊 Market prices may change during execution</li>
            </ul>
          </div>
        </div>
      )}

      {/* Result Modal (only for executed success/fail) */}
      {showResultModal && (
        <div
          className="successErrorModal-overlay"
          onClick={handleCloseResultModal}
        >
          <div
            className={`successErrorModal ${
              resultType === "success" ? "success" : "failed"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{resultMessage}</h2>

            <p>
              {resultType === "success" ? (
                <>
                  ✅ Your trade completed successfully. The PnL shown above has
                  been applied to your balance.
                  <br />
                  💰 You can view the updated balance on the dashboard.
                </>
              ) : (
                <>
                  ❌ Your trade failed. No funds were lost beyond the stake
                  shown, and you can review the trade details in history.
                  <br />
                  📊 Consider reviewing your strategy or trying again.
                </>
              )}
            </p>

            <div style={{ marginTop: 12 }}>
              <button className="close-btn" onClick={handleCloseResultModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="footers">
        <footer id="hki_footer">
          <div className="hki_credit_line">
            <span>📣 Call to Action</span>
            <div className="hki_footer_links">
              <a>Trust</a> AND <a>Reliable</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
