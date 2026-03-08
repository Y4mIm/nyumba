import React, { useState, useEffect, useCallback } from "react";
import "./Saved.css";
import { getSavedProperties, fetchProperties } from "./supabase";

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

function Saved({ onNavigate, onBack, user, token, currentPage }) {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = useCallback(async () => {
    setLoading(true);
    const savedIds = await getSavedProperties(user.id, token);
    const allProperties = await fetchProperties();
    if (Array.isArray(allProperties) && Array.isArray(savedIds)) {
      const saved = allProperties.filter(p => savedIds.includes(p.id));
      setSavedProperties(saved);
    }
    setLoading(false);
  }, [user, token]);

  useEffect(() => {
    if (user) loadSaved();
  }, [user, loadSaved]);

  return (
    <div className="saved-page">

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

      <div className="saved-header">
        <div className="saved-header-inner">
          <h2>Saved Properties</h2>
          <p>Properties you have saved for later</p>
        </div>
      </div>

      <div className="saved-container">
        {loading ? (
          <p className="saved-loading">Loading your saved properties...</p>
        ) : savedProperties.length === 0 ? (
          <div className="saved-empty">
            <div className="empty-icon">🏠</div>
            <h3>No saved properties yet</h3>
            <p>Browse listings and click the heart icon to save properties you like</p>
            <button className="browse-btn" onClick={() => onNavigate("listings")}>Browse Properties</button>
          </div>
        ) : (
          <div className="saved-grid">
            {savedProperties.map(property => (
              <div className="card" key={property.id}>
                <div className="card-img">
                  {property.image_url ? (
                    <img src={property.image_url} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    property.emoji
                  )}
                </div>
                <div className="card-info">
                  <span className={"badge " + property.listing_type}>
                    {property.listing_type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  <h3>{property.title}</h3>
                  <p>📍 {property.location}</p>
                  <p>🛏️ {property.bedrooms} Bedrooms</p>
                  <p className="price">{property.price_label}</p>
                  <button className="view-btn" onClick={() => onNavigate("detail", property)}>View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
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
        <div className={`bottom-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate(user ? "dashboard" : "auth")}>
          <UserIcon />
          <span>{user ? "Profile" : "Login"}</span>
        </div>
      </div>

    </div>
  );
}

export default Saved;