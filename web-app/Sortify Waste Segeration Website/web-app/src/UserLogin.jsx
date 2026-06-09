import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function UserLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple mock login
    if (username && password) {
      navigate("/dashboard");
    } else {
      alert("Enter username & password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleLogin}
        className="bg-slate-800 p-8 rounded-2xl shadow-lg w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-400 mb-4">User Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
