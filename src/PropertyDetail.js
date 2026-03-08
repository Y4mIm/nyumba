import React from "react";
import "./PropertyDetail.css";

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

function PropertyDetail({ property, onNavigate, onBack, user, currentPage }) {
  const features = typeof property.features === "string"
    ? property.features.split(",")
    : property.features || [];

  const badge = property.badge || property.listing_type;
  const label = property.label || (property.listing_type === "rent" ? "For Rent" : "For Sale");
  const priceLabel = property.priceLabel || property.price_label;

  return (
    <div className="detail-page">

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

      <div className="breadcrumb">
        <div className="breadcrumb-inner">
          <span onClick={() => onNavigate("home")}>Home</span>
          <span>&middot;</span>
          <span onClick={() => onNavigate("listings")}>Listings</span>
          <span>&middot;</span>
          <span>{property.title}</span>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-left">
          <div className="detail-img">
            {property.image_url ? (
              <img src={property.image_url} alt={property.title} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "24px" }} />
            ) : (
              property.emoji
            )}
          </div>
          <div className="detail-info">
            <span className={"badge " + badge}>{label}</span>
            <h2>{property.title}</h2>
            <p className="detail-location">📍 {property.location}</p>
            <p className="detail-price">{priceLabel}</p>
            <div className="detail-specs">
              <div className="spec">{property.bedrooms} Bedrooms</div>
              <div className="spec">{property.bathrooms} Bathrooms</div>
              <div className="spec">{property.size} sqm</div>
              <div className="spec">{property.city}</div>
            </div>
            <div className="detail-description">
              <h3>About This Property</h3>
              <p>{property.description}</p>
            </div>
            {features.length > 0 && (
              <div className="detail-features">
                <h3>Features</h3>
                <div className="features-grid">
                  {features.map((feature, index) => (
                    <div className="feature-item" key={index}>{feature.trim()}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="detail-right">
          <div className="contact-card">
            <h3>Contact Landlord</h3>
            <div className="landlord-info">
              <div className="landlord-avatar">
                {property.landlord ? property.landlord.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                <p className="landlord-name">{property.landlord}</p>
                <p className="landlord-type">Private Landlord</p>
              </div>
            </div>
            <a href={"https://wa.me/" + property.whatsapp} target="_blank" rel="noreferrer" className="whatsapp-btn">
              Chat on WhatsApp
            </a>
            <a href={"tel:" + property.phone} className="phone-btn">
              Call {property.phone}
            </a>
            <p className="contact-note">Mention you found this on Nyumba</p>
          </div>

          <div className="safety-card">
            <h3>Safety Tips</h3>
            <ul>
              <li>Always view the property in person before paying</li>
              <li>Never send money before signing an agreement</li>
              <li>Verify the landlord owns the property</li>
              <li>Get a written rental or sale agreement</li>
            </ul>
          </div>
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
        <div className={`bottom-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate(user ? "dashboard" : "auth")}>
          <UserIcon />
          <span>{user ? "Profile" : "Login"}</span>
        </div>
      </div>

    </div>
  );
}

export default PropertyDetail;