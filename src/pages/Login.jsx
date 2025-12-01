// src/pages/Login.jsx
import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e?.preventDefault?.();
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (!res.ok) {
        alert(res.message || "Login failed");
        return;
      }
      // server should return token
      if (res.token) {
        localStorage.setItem("token", res.token);
        alert("Login successful");
        navigate("/");
      } else {
        alert("Login succeeded but no token returned");
      }
    } catch (err) {
      console.error(err);
      alert("Login error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "40px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
    </div>
  );
}
