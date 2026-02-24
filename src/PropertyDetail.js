import React from 'react';
import './PropertyDetail.css';

function PropertyDetail({ property, onNavigate }) {
  return (
    <div className="detail-page">

      <nav className="navbar">
        <h1 onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Nyumba 🏠</h1>
        <div className="navbar-links">
          <a href="#" onClick={() => onNavigate('home')}>Home</a>
          <a href="#" onClick={() => onNavigate('listings')}>Buy</a>
          <a href="#" onClick={() => onNavigate('listings')}>Rent</a>
          <a href="#">List Property</a>
        </div>
      </nav>

      <div className="breadcrumb">
        <span onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Home</span>
        <span> › </span>
        <span onClick={() => onNavigate('listings')} style={{ cursor: 'pointer' }}>Listings</span>
        <span> › </span>
        <span>{property.title}</span>
      </div>

      <div className="detail-container">

        <div className="detail-left">
          <div className="detail-img">{property.emoji}</div>
          <div className="detail-info">
            <span className={`badge ${property.badge}`}>{property.label}</span>
            <h2>{property.title}</h2>
            <p className="detail-location">📍 {property.location}</p>
            <p className="detail-price">{property.priceLabel}</p>
            <div className="detail-specs">
              <div className="spec">🛏️ {property.bedrooms} Bedrooms</div>
              <div className="spec">🚿 {property.bathrooms} Bathrooms</div>
              <div className="spec">📐 {property.size} sqm</div>
              <div className="spec">🏙️ {property.city}</div>
            </div>
            <div className="detail-description">
              <h3>About This Property</h3>
              <p>{property.description}</p>
            </div>
            <div className="detail-features">
              <h3>Features</h3>
              <div className="features-grid">
                {property.features.map((feature, index) => (
                  <div className="feature-item" key={index}>✓ {feature}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="detail-right">
          <div className="contact-card">
            <h3>Contact Landlord</h3>
            <div className="landlord-info">
              <div className="landlord-avatar">👤</div>
              <div>
                <p className="landlord-name">{property.landlord}</p>
                <p className="landlord-type">{property.landlordType}</p>
              </div>
            </div>
            <a
              href={"https://wa.me/" + property.whatsapp + "?text=Hello, I am interested in: " + property.title}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-btn"
            >
              💬 Chat on WhatsApp
            </a>
            <a href={"tel:" + property.phone} className="phone-btn">
              📞 Call {property.phone}
            </a>
            <p className="contact-note">Mention you found this on Nyumba</p>
          </div>
          <div className="safety-card">
            <h3>🛡️ Safety Tips</h3>
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
        <p>© 2026 Nyumba · Built for Malawi 🇲🇼</p>
      </footer>

    </div>
  );
}

export default PropertyDetail;