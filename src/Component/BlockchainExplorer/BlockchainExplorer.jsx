import React from "react";
import "./BlockchainExplorer.css";
import { Link } from "react-router-dom";

const BlockchainExplorer = () => {
  const transactions = [
    {
      hash: "0xabc123456789",
      from: "0x1111abcd1234",
      to: "0x2222efgh5678",
      amount: "1.25 ETH",
      gasFee: "0.005 ETH",
      time: "2 mins ago",
    },
    {
      hash: "0xdef789012345",
      from: "0x3333ijkl9012",
      to: "0x4444mnop3456",
      amount: "0.75 ETH",
      gasFee: "0.003 ETH",
      time: "5 mins ago",
    },
    {
      hash: "0xghi456789012",
      from: "0x5555qrst7890",
      to: "0x6666uvwx2345",
      amount: "3.5 ETH",
      gasFee: "0.01 ETH",
      time: "10 mins ago",
    },
  ];

  return (
    <div className="container">
      <header className="header">
        <div className="logo">🔗 CryptoFIScan</div>
        <nav>
          <ul>
            <li>
              <a>Explorer</a>
            </li>
          </ul>
        </nav>
      </header>

      <section className="hero">
        <h1>Explore Blockchain Activity in Real-Time</h1>
        <p>
          Track blocks, transactions, gas fees, and more. Fast. Secure.
          Reliable.
        </p>
        <Link to="/">
          <button>Get Started</button>
        </Link>
      </section>

      <section className="stats">
        <div className="stat-card">
          <h2>12,345</h2>
          <p>Latest Block</p>
        </div>
        <div className="stat-card">
          <h2>0.0032 ETH</h2>
          <p>Avg Gas Fee</p>
        </div>
        <div className="stat-card">
          <h2>0x1a2b...9z8y</h2>
          <p>Top Sender</p>
        </div>
      </section>

      <section className="transactions">
        <h2>Recent Transactions</h2>
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Tx Hash</th>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Gas Fee</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td data-label="Tx Hash">{tx.hash}</td>
                <td data-label="From">{tx.from}</td>
                <td data-label="To">{tx.to}</td>
                <td data-label="Amount">{tx.amount}</td>
                <td data-label="Gas Fee">{tx.gasFee}</td>
                <td data-label="Time">{tx.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer>
        <p>
          &copy; {new Date().getFullYear()} CryptoFIScan. All rights reserved 🚀
        </p>
      </footer>
    </div>
  );
};

export default BlockchainExplorer;
