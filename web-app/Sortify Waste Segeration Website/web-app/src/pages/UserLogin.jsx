// UserLogin.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "../supabase"; // adjust path if needed
import { useNavigate } from "react-router-dom";

export default function UserLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !username || !password) return alert("All fields required!");
    const { data: existing } = await supabase.from("users").select("*").eq("username", username).single();
    if (existing) return alert("Username exists! Try login.");

    const { error } = await supabase.from("users").insert([{ name, username, password }]);
    if (error) alert(error.message);
    else {
      alert("✅ Registered! Please log in.");
      setIsRegister(false);
      setName("");
      setUsername("");
      setPassword("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return alert("Enter both fields!");
    const { data, error } = await supabase.from("users").select("*").eq("username", username).eq("password", password).single();
    if (error || !data) return alert("❌ Invalid credentials");
    alert(`Welcome ${data.name}!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form onSubmit={isRegister ? handleRegister : handleLogin} className="bg-slate-800 p-8 rounded-2xl shadow-lg w-96 space-y-4">
        <h2 className="text-2xl font-bold text-green-400 text-center mb-4">
          {isRegister ? "User Registration" : "User Login"}
        </h2>

        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-slate-700 text-white"
          />
        )}

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
          {isRegister ? "Register" : "Login"}
        </Button>

        <p className="text-center text-slate-400 text-sm mt-3">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsRegister(false)}
                className="text-green-400 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setIsRegister(true)}
                className="text-green-400 cursor-pointer hover:underline"
              >
                Register here
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
