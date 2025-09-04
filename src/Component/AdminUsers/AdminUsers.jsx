import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [amounts, setAmounts] = useState({});

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
      // const res = await axios.get("http://localhost:5000/api/users", {
      const res = await axios.get("https://investmentbackend-6m5g.onrender.com/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAmountChange = (e, userId) => {
    setAmounts({ ...amounts, [userId]: e.target.value });
  };

  const handleAddBalance = async (userId) => {
    const token = localStorage.getItem("token");
    const amount = amounts[userId];

    if (!amount || isNaN(amount)) return alert("Enter a valid amount");

    try {
      await axios.post(
        // "http://localhost:5000/api/admin/update-balance",
        "https://investmentbackend-6m5g.onrender.com/api/admin/update-balance",
        { userId, amount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Usdt sent successfully");
      fetchUsers(); 
    } catch (err) {
      console.error("Error adding balance:", err);
      alert("Failed to update balance");
    }
  };

  return (
    <div className="admin-container">
      <h2>CryptoFi Log</h2>
      <p>All Registered Users</p>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="user-list">
          {users.map((user) => (
            <li key={user._id} className="user-card">
              <div>
                <strong>{user.name}</strong> ({user.email})<br />
                Role: <b>{user.role}</b><br />
                Balance: ${user.balance?.toFixed(2) || 0}
              </div>

              <div className="balance-action">
                <input
                  type="number"
                  placeholder="Usdt Amount"
                  value={amounts[user._id] || ""}
                  onChange={(e) => handleAmountChange(e, user._id)}
                />
                <button onClick={() => handleAddBalance(user._id)}>Add</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminUsers;
