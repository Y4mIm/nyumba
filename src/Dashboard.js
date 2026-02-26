import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const SUPABASE_URL = "https://zjeelyapynksqjkwynik.supabase.co";
const SUPABASE_KEY = "sb_publishable_aC-v7-herXgYLMJ0YEgXUQ_0rAxdzBe";

function Dashboard({ onNavigate, user, token }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) loadMyProperties();
  }, [user]);

  const loadMyProperties = async () => {
    setLoading(true);
    const response = await fetch(SUPABASE_URL + "/rest/v1/properties?landlord_email=eq." + encodeURIComponent(user.email || "") + "&order=created_at.desc", {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + (token || SUPABASE_KEY)
      }
    });
    const data = await response.json();
    if (Array.isArray(data)) setProperties(data);
    setLoading(false);
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
      loadMyProperties();
    }
  };

  const filtered = activeTab === "all" ? properties : properties.filter(p => p.status === activeTab);
  const pendingCount = properties.filter(p => p.status === "pending").length;
  const approvedCount = properties.filter(p => p.status === "approved").length;

  if (!user) {
    return (
      <div className="dashboard-page">
        <nav className="navbar">
          <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Nyumba</h1>
        </nav>
        <div className="dashboard-empty">
          <h3>Please log in to view your dashboard</h3>
          <button className="dash-btn" onClick={() => onNavigate("auth")}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Nyumba</h1>
        <div className="navbar-links">
          <span onClick={() => onNavigate("home")} className="nav-link">Home</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Listings</span>
          <span onClick={() => onNavigate("list")} className="nav-link">Add Property</span>
        </div>
      </nav>

      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <h2>My Dashboard</h2>
          <p>Welcome back, {user.email}</p>
        </div>
        <button className="add-property-btn" onClick={() => onNavigate("list")}>
          + Add New Property
        </button>
      </div>

      <div className="dashboard-stats">
        <div className="dash-stat">
          <span className="dash-stat-number">{properties.length}</span>
          <span className="dash-stat-label">Total Listings</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-number">{pendingCount}</span>
          <span className="dash-stat-label">Pending Review</span>
        </div>
        <div className="dash-stat">
          <span className="dash-stat-number">{approvedCount}</span>
          <span className="dash-stat-label">Live Listings</span>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="dashboard-tabs">
          <button className={"dash-tab " + (activeTab === "all" ? "active" : "")} onClick={() => setActiveTab("all")}>
            All ({properties.length})
          </button>
          <button className={"dash-tab " + (activeTab === "approved" ? "active" : "")} onClick={() => setActiveTab("approved")}>
            Live ({approvedCount})
          </button>
          <button className={"dash-tab " + (activeTab === "pending" ? "active" : "")} onClick={() => setActiveTab("pending")}>
            Pending ({pendingCount})
          </button>
        </div>

        {loading ? (
          <p className="dash-loading">Loading your listings...</p>
        ) : filtered.length === 0 ? (
          <div className="dashboard-empty">
            <div className="empty-icon">??</div>
            <h3>No listings yet</h3>
            <p>Click the button below to add your first property</p>
            <button className="dash-btn" onClick={() => onNavigate("list")}>Add Property</button>
          </div>
        ) : (
          <div className="dash-listings">
            {filtered.map(property => (
              <div className="dash-card" key={property.id}>
                <div className="dash-card-img">
                  {property.image_url ? (
                    <img src={property.image_url} alt={property.title} />
                  ) : (
                    property.emoji
                  )}
                </div>
                <div className="dash-card-info">
                  <div className="dash-card-top">
                    <span className={"badge " + property.listing_type}>
                      {property.listing_type === "rent" ? "For Rent" : "For Sale"}
                    </span>
                    <span className={"status-badge " + property.status}>{property.status}</span>
                  </div>
                  <h3>{property.title}</h3>
                  <p>{property.location}</p>
                  <p>{property.price_label}</p>
                  <p>{property.bedrooms} bed · {property.bathrooms} bath</p>
                </div>
                <div className="dash-card-actions">
                  <button className="dash-view-btn" onClick={() => onNavigate("detail", property)}>View</button>
                  <button className="dash-delete-btn" onClick={() => deleteProperty(property.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="footer">
        <p>2026 Nyumba - Built for Malawi</p>
      </footer>
    </div>
  );
}

export default Dashboard;
