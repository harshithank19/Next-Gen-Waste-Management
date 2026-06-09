// App.jsx (shortened version)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import RewardDashboard from "./RewardDashboard";

// Dashboards
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import DriverDashboard from "./pages/DriverDashboard";

// Logins
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import DriverLogin from "./pages/DriverLogin";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/driver-login" element={<DriverLogin />} />
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/rewards" element={<RewardDashboard />} />
      </Routes>
    </Router>
  );
}
