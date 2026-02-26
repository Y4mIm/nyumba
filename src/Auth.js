import React, { useState } from "react";
import "./Auth.css";

const SUPABASE_URL = "https://zjeelyapynksqjkwynik.supabase.co";
const SUPABASE_KEY = "sb_publishable_aC-v7-herXgYLMJ0YEgXUQ_0rAxdzBe";

function Auth({ onNavigate, onLogin }) {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    user_type: "seeker"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(SUPABASE_URL + "/auth/v1/token?grant_type=password", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    const data = await response.json();
    if (data.access_token) {
      onLogin(data.user, data.access_token);
    } else {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const response = await fetch(SUPABASE_URL + "/auth/v1/signup", {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });
    const data = await response.json();
    if (data.id || data.user) {
      const userId = data.id || data.user.id;
      await fetch(SUPABASE_URL + "/rest/v1/profiles", {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          id: userId,
          full_name: formData.full_name,
          phone: formData.phone,
          user_type: formData.user_type
        })
      });
      setMode("login");
      setError("Account created! Please log in.");
    } else {
      setError(data.msg || data.message || "Registration failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <nav className="navbar">
        <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Nyumba</h1>
        <div className="navbar-links">
          <span onClick={() => onNavigate("home")} className="nav-link">Home</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Buy</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Rent</span>
          <span onClick={() => onNavigate("list")} className="nav-link">List Property</span>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={"auth-tab " + (mode === "login" ? "active" : "")}
              onClick={() => { setMode("login"); setError(""); }}
            >
              Login
            </button>
            <button
              className={"auth-tab " + (mode === "register" ? "active" : "")}
              onClick={() => { setMode("register"); setError(""); }}
            >
              Register
            </button>
          </div>

          {error && (
            <div className={"auth-message " + (error.includes("created") ? "success" : "error")}>
              {error}
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={handleLogin}>
              <div className="auth-form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="auth-form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Your password" required />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="auth-switch">
                No account? <span onClick={() => setMode("register")}>Register here</span>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="auth-form-group">
                <label>Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="e.g. Yami Kapesi" required />
              </div>
              <div className="auth-form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
              </div>
              <div className="auth-form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+265991234567" required />
              </div>
              <div className="auth-form-group">
                <label>I am a</label>
                <select name="user_type" value={formData.user_type} onChange={handleChange}>
                  <option value="seeker">Property Seeker</option>
                  <option value="lister">Landlord / Agent</option>
                </select>
              </div>
              <div className="auth-form-group">
                <label>Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required />
              </div>
              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
              <p className="auth-switch">
                Have an account? <span onClick={() => setMode("login")}>Login here</span>
              </p>
            </form>
          )}
        </div>
      </div>

      <footer className="footer">
        <p>2026 Nyumba - Built for Malawi</p>
      </footer>
    </div>
  );
}

export default Auth;
