// src/pages/Register.jsx
import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e?.preventDefault?.();
    setLoading(true);
    try {
      const res = await api.register(name, email, phone, password);
      if (!res.ok) {
        alert(res.message || "Registration failed");
        return;
      }
      // If backend returns token, save it; otherwise navigate to login
      if (res.token) localStorage.setItem("token", res.token);
      alert("Account created");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Error registering");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h2>Create Account</h2>
      <form onSubmit={handleRegister}>
        <input className="input" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} required />
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="input" placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        <button className="btn" type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</button>
      </form>
    </div>
  );
}
