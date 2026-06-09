// DriverLogin.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function DriverLogin() {
  const [driverId, setDriverId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (driverId && password) navigate("/driver-dashboard");
    else alert("Enter Driver ID and password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-2xl w-96 space-y-4">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Driver Login</h2>
        <input
          type="text"
          placeholder="Driver ID"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded bg-slate-700 text-white"
        />
        <Button type="submit" className="w-full gradient-bg">
          Login
        </Button>
      </form>
    </div>
  );
}