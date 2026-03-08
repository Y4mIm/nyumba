import React, { useState } from "react";
import "./Auth.css";

const SUPABASE_URL = "https://zjeelyapynksqjkwynik.supabase.co";
const SUPABASE_KEY = "sb_publishable_aC-v7-herXgYLMJ0YEgXUQ_0rAxdzBe";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

function Auth({ onNavigate, onLogin, onBack, user, currentPage }) {
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
        <div className="navbar-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={onBack} style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "20px",
              color: "#111827",
              padding: "5px 12px",
              borderRadius: "10px",
              lineHeight: 1,
              fontWeight: "600"
            }}>&#8592;</button>
            <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Nyumba</h1>
          </div>
          <div className="navbar-links">
            <span onClick={() => onNavigate("home")} className="nav-link">Home</span>
            <span onClick={() => onNavigate("listings")} className="nav-link">Buy</span>
            <span onClick={() => onNavigate("listings")} className="nav-link">Rent</span>
            <span onClick={() => onNavigate("list")} className="nav-link">List Property</span>
          </div>
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
        <p>&copy; 2026 Nyumba &middot; Built for Malawi</p>
      </footer>

      <div className="bottom-nav">
        <div className={`bottom-nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => onNavigate("home")}>
          <HomeIcon />
          <span>Home</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'listings' ? 'active' : ''}`} onClick={() => onNavigate("listings")}>
          <SearchIcon />
          <span>Search</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'list' ? 'active' : ''}`} onClick={() => onNavigate("list")}>
          <PlusIcon />
          <span>List</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'saved' ? 'active' : ''}`} onClick={() => onNavigate(user ? "saved" : "auth")}>
          <HeartIcon />
          <span>Saved</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'auth' ? 'active' : ''}`} onClick={() => onNavigate(user ? "dashboard" : "auth")}>
          <UserIcon />
          <span>{user ? "Profile" : "Login"}</span>
        </div>
      </div>

    </div>
  );
}

export default Auth;