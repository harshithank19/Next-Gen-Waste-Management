// src/components/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminLogin({ onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (res.error) {
        setError(res.error.message || JSON.stringify(res.error));
        return;
      }

      // inform parent and navigate to dashboard
      if (typeof onSignedIn === "function") onSignedIn(res.data.user);
      navigate("/admin-dashboard", { replace: true });
    } catch (err) {
      setLoading(false);
      console.error("signIn unexpected error:", err);
      setError("Network error: " + (err?.message || JSON.stringify(err)));
    }
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg mb-6 text-white">
      <h2 className="text-xl mb-3 font-semibold">Admin Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col md:flex-row gap-3">
        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-slate-700"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-slate-700"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 px-4 py-2 rounded"
        >
          {loading ? "Signing..." : "Login"}
        </button>
      </form>
      {error && <div className="text-red-400 mt-2">{error}</div>}
    </div>
  );
}
