import React, { useState, useEffect } from 'react';
import { fetchProperties } from './supabase';
import './App.css';
import Listings from './Listings';
import PropertyDetail from './PropertyDetail.js';
import ListProperty from './ListProperty';
import Admin from './Admin';

function App() {
  const [page, setPage] = useState('home');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    const data = await fetchProperties();
    if (Array.isArray(data)) {
      setProperties(data.slice(0, 6));
    }
  };

  const handleNavigate = (target, data) => {
    setPage(target);
    if (target === 'detail') setSelectedProperty(data);
    window.scrollTo(0, 0);
  };

  if (page === 'listings') {
    return <Listings onNavigate={handleNavigate} />;
  }

  if (page === 'detail' && selectedProperty) {
    return <PropertyDetail property={selectedProperty} onNavigate={handleNavigate} />;
  }

  if (page === 'list') {
    return <ListProperty onNavigate={handleNavigate} />;
  }

  if (page === 'admin') {
    return <Admin onNavigate={handleNavigate} />;
  }

  return (
    <div className="app">

      <nav className="navbar">
        <h1>Nyumba 🏠</h1>
        <div className="navbar-links">
          <a href="#" onClick={() => handleNavigate('home')}>Home</a>
          <a href="#" onClick={() => handleNavigate('listings')}>Buy</a>
          <a href="#" onClick={() => handleNavigate('listings')}>Rent</a>
          <a href="#" onClick={() => handleNavigate('list')}>List Property</a>
        </div>
      </nav>

      <div className="hero">
        <h2>Find Your Perfect Home in Malawi</h2>
        <p>Search properties for rent and sale in Blantyre and Lilongwe</p>
        <div className="search-bar">
          <input type="text" placeholder="Search by area, e.g. Area 47, Limbe..." />
          <button onClick={() => handleNavigate('listings')}>Search</button>
        </div>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-number">500+</span>
          <span className="stat-label">Properties Listed</span>
        </div>
        <div className="stat">
          <span className="stat-number">2</span>
          <span className="stat-label">Cities Covered</span>
        </div>
        <div className="stat">
          <span className="stat-number">1,200+</span>
          <span className="stat-label">Happy Tenants</span>
        </div>
        <div className="stat">
          <span className="stat-number">300+</span>
          <span className="stat-label">Verified Landlords</span>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Browse by Property Type</h2>
        <div className="categories">
          <div className="category-card" onClick={() => handleNavigate('listings')}>
            <span>🏡</span><p>Houses</p>
          </div>
          <div className="category-card" onClick={() => handleNavigate('listings')}>
            <span>🏢</span><p>Apartments</p>
          </div>
          <div className="category-card" onClick={() => handleNavigate('listings')}>
            <span>🏘️</span><p>Flats</p>
          </div>
          <div className="category-card" onClick={() => handleNavigate('listings')}>
            <span>🏗️</span><p>Under Construction</p>
          </div>
          <div className="category-card" onClick={() => handleNavigate('listings')}>
            <span>🏬</span><p>Commercial</p>
          </div>
        </div>
      </div>

      <div className="section city-section">
        <h2 className="section-title">Explore by City</h2>
        <div className="cities">
          <div className="city-card" onClick={() => handleNavigate('listings')}>
            <div className="city-img">🌆</div>
            <div className="city-info">
              <h3>Blantyre</h3>
              <p>210 properties available</p>
            </div>
          </div>
          <div className="city-card" onClick={() => handleNavigate('listings')}>
            <div className="city-img">🏙️</div>
            <div className="city-info">
              <h3>Lilongwe</h3>
              <p>290 properties available</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Featured Properties</h2>
        <div className="listings">
          {properties.map(property => (
            <div className="card" key={property.id}>
              <div className="card-img">
                {property.image_url ? (
                  <img src={property.image_url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                ) : (
                  property.emoji
                )}
              </div>
              <div className="card-info">
                <span className={`badge ${property.listing_type}`}>
                  {property.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
                <h3>{property.title}</h3>
                <p>📍 {property.location}</p>
                <p className="price">{property.price_label}</p>
                <button className="view-btn" onClick={() => handleNavigate('detail', property)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section how-it-works">
        <h2 className="section-title">How Nyumba Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-icon">🔍</div>
            <h3>Search</h3>
            <p>Browse hundreds of verified properties across Blantyre and Lilongwe</p>
          </div>
          <div className="step">
            <div className="step-icon">📞</div>
            <h3>Connect</h3>
            <p>Contact landlords and agents directly via WhatsApp or phone call</p>
          </div>
          <div className="step">
            <div className="step-icon">🏠</div>
            <h3>Move In</h3>
            <p>Schedule a viewing, agree on terms and move into your new home</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Do You Have a Property to List?</h2>
        <p>Join hundreds of landlords and agents already using Nyumba to find tenants and buyers fast.</p>
        <button className="cta-btn" onClick={() => handleNavigate('list')}>List Your Property — It's Free</button>
      </div>

      <footer className="footer">
        <p>© 2026 Nyumba · Built for Malawi 🇲🇼 · Blantyre & Lilongwe</p>
        <p className="admin-link" onClick={() => handleNavigate('admin')}>Admin</p>
      </footer>

    </div>
  );
}

export default App;