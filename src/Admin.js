import React, { useState, useEffect } from "react";
import "./Admin.css";

const ADMIN_PASSWORD = "nyumba2026";
const SUPABASE_URL = "https://zjeelyapynksqjkwynik.supabase.co";
const SUPABASE_KEY = "sb_publishable_aC-v7-herXgYLMJ0YEgXUQ_0rAxdzBe";

function Admin({ onNavigate }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      loadProperties();
    } else {
      alert("Wrong password!");
    }
  };

  const loadProperties = async () => {
    setLoading(true);
    const response = await fetch(SUPABASE_URL + "/rest/v1/properties?order=created_at.desc", {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      }
    });
    const data = await response.json();
    if (Array.isArray(data)) setProperties(data);
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    await fetch(SUPABASE_URL + "/rest/v1/properties?id=eq." + id, {
      method: "PATCH",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });
    loadProperties();
  };

  const deleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await fetch(SUPABASE_URL + "/rest/v1/properties?id=eq." + id, {
        method: "DELETE",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY
        }
      });
      loadProperties();
    }
  };

  const filtered = properties.filter(p => p.status === activeTab);
  const pendingCount = properties.filter(p => p.status === "pending").length;
  const approvedCount = properties.filter(p => p.status === "approved").length;

  if (!authenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>Nyumba Admin</h2>
          <p>Enter your password to continue</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          <span onClick={() => onNavigate("home")} className="back-link">Back to site</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-navbar">
        <h1>Nyumba Admin Panel</h1>
        <div className="admin-nav-right">
          <span onClick={() => onNavigate("home")} className="view-site">View Site</span>
          <span onClick={() => setAuthenticated(false)} className="logout">Logout</span>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <span className="admin-stat-number">{properties.length}</span>
          <span className="admin-stat-label">Total Listings</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-number">{pendingCount}</span>
          <span className="admin-stat-label">Pending Review</span>
        </div>
        <div className="admin-stat">
          <span className="admin-stat-number">{approvedCount}</span>
          <span className="admin-stat-label">Approved</span>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          className={"tab-btn " + (activeTab === "pending" ? "active" : "")}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pendingCount})
        </button>
        <button
          className={"tab-btn " + (activeTab === "approved" ? "active" : "")}
          onClick={() => setActiveTab("approved")}
        >
          Approved ({approvedCount})
        </button>
      </div>

      <div className="admin-listings">
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="loading-text">No {activeTab} listings.</p>
        ) : (
          filtered.map(property => (
            <div className="admin-card" key={property.id}>
              <div className="admin-card-left">
                <div className="admin-emoji">{property.emoji}</div>
              </div>
              <div className="admin-card-info">
                <div className="admin-card-top">
                  <span className={"badge " + property.listing_type}>
                    {property.listing_type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  <span className={"status-badge " + property.status}>{property.status}</span>
                </div>
                <h3>{property.title}</h3>
                <p>{property.location}</p>
                <p>{property.price_label}</p>
                <p>{property.bedrooms} bed · {property.bathrooms} bath · {property.size} sqm</p>
                <p className="admin-landlord">Landlord: {property.landlord} · {property.phone}</p>
                <p className="admin-description">{property.description}</p>
              </div>
              <div className="admin-card-actions">
                {property.status === "pending" && (
                  <button className="approve-btn" onClick={() => updateStatus(property.id, "approved")}>
                    Approve
                  </button>
                )}
                {property.status === "approved" && (
                  <button className="reject-btn" onClick={() => updateStatus(property.id, "pending")}>
                    Unpublish
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteProperty(property.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Admin;
