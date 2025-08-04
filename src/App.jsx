import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Component/Authentication/Register/Register";
import Login from "./Component/Authentication/Login/Login";
import Dashboard from "./Component/Dashboard/Dashboard";
import Home from "./Component/Home/Home";
import ProtectedRoute from "./utils/ProtectedRoute";
import AdminUsers from "./Component/AdminUsers/AdminUsers";
import BlockchainExplorer from "./Component/BlockchainExplorer/BlockchainExplorer";
import CryptoFiRoadmap from "./Component/CryptoFiRoadmap/CryptoFiRoadmap";
import CryptoAI from "./Component/CryptoAI/CryptoAI";
import Trading from "./Component/Trading/Trading";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/trading" element={<Trading/>}/>
        <Route path="/blockchainExplorer" element={<BlockchainExplorer/>}/>
        <Route path="/cryptoAI" element={<CryptoAI/>}/>
        <Route path="/cryptoFiRoadmap" element={<CryptoFiRoadmap/>}/>
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </Router>
  );
}

export default App;
