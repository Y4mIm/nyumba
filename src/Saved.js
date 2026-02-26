import React, { useState, useEffect } from "react";
import "./Saved.css";
import { getSavedProperties, fetchProperties } from "./supabase";

function Saved({ onNavigate, user, token }) {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadSaved();
  }, [user]);

  const loadSaved = async () => {
    setLoading(true);
    const savedIds = await getSavedProperties(user.id, token);
    console.log('User ID:', user.id);
    console.log('Token:', token);
    console.log('Saved IDs:', savedIds);
    const allProperties = await fetchProperties();
    console.log('All properties:', allProperties.length);
    if (Array.isArray(allProperties) && Array.isArray(savedIds)) {
      const saved = allProperties.filter(p => savedIds.includes(p.id));
      console.log('Filtered saved:', saved.length);
      setSavedProperties(saved);
    }
    setLoading(false);
  };

  return (
    <div className="saved-page">
      <nav className="navbar">
        <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Nyumba</h1>
        <div className="navbar-links">
          <span onClick={() => onNavigate("home")} className="nav-link">Home</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Buy</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Rent</span>
          <span onClick={() => onNavigate("list")} className="nav-link">List Property</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Saved</span>
        </div>
      </nav>

      <div className="saved-header">
        <h2>Saved Properties</h2>
        <p>Properties you have saved for later</p>
      </div>

      <div className="saved-container">
        {loading ? (
          <p className="saved-loading">Loading your saved properties...</p>
        ) : savedProperties.length === 0 ? (
          <div className="saved-empty">
            <div className="empty-icon">??</div>
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
                    <img src={property.image_url} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                  ) : (
                    property.emoji
                  )}
                </div>
                <div className="card-info">
                  <span className={"badge " + property.listing_type}>
                    {property.listing_type === "rent" ? "For Rent" : "For Sale"}
                  </span>
                  <h3>{property.title}</h3>
                  <p>{property.location}</p>
                  <p>{property.bedrooms} Bedrooms</p>
                  <p className="price">{property.price_label}</p>
                  <button className="view-btn" onClick={() => onNavigate("detail", property)}>View Details</button>
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

export default Saved;
