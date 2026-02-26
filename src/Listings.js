import React, { useState, useEffect } from 'react';
import './Listings.css';
import { fetchProperties } from './supabase';

function Listings({ onNavigate }) {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    const data = await fetchProperties();
    if (Array.isArray(data)) {
      setAllProperties(data);
    }
    setLoading(false);
  };

  const filtered = allProperties.filter(p => {
    const matchSearch = p.location.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === 'All' || p.city === city;
    const matchType = type === 'All' || p.listing_type === type;
    const matchBedrooms = bedrooms === 'All' || p.bedrooms === parseInt(bedrooms);
    return matchSearch && matchCity && matchType && matchBedrooms;
  });

  return (
    <div className="listings-page">

      <nav className="navbar">
        <h1 onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Nyumba 🏠</h1>
        <div className="navbar-links">
          <a href="#" onClick={() => onNavigate('home')}>Home</a>
          <a href="#" onClick={() => onNavigate('listings')}>Buy</a>
          <a href="#" onClick={() => onNavigate('listings')}>Rent</a>
          <a href="#" onClick={() => onNavigate('list')}>List Property</a>
        </div>
      </nav>

      <div className="listings-header">
        <h2>Properties in Blantyre & Lilongwe</h2>
        <p>Find your perfect home from our verified listings</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by area or title..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="filter-search"
        />
        <select value={city} onChange={e => setCity(e.target.value)}>
          <option value="All">All Cities</option>
          <option value="Blantyre">Blantyre</option>
          <option value="Lilongwe">Lilongwe</option>
        </select>
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="All">Rent & Sale</option>
          <option value="rent">For Rent</option>
          <option value="sale">For Sale</option>
        </select>
        <select value={bedrooms} onChange={e => setBedrooms(e.target.value)}>
          <option value="All">Any Bedrooms</option>
          <option value="1">1 Bedroom</option>
          <option value="2">2 Bedrooms</option>
          <option value="3">3 Bedrooms</option>
          <option value="4">4 Bedrooms</option>
          <option value="5">5+ Bedrooms</option>
        </select>
      </div>

      <div className="results-count">
        {loading ? 'Loading properties...' : (
          <>Showing <strong>{filtered.length}</strong> properties
          {city !== 'All' && ` in ${city}`}
          {type !== 'All' && ` · ${type === 'rent' ? 'For Rent' : 'For Sale'}`}</>
        )}
      </div>

      <div className="listings-grid">
        {loading ? (
          <div className="no-results"><p>Loading properties...</p></div>
        ) : filtered.length > 0 ? (
          filtered.map(property => (
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
                <p>🛏️ {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</p>
                <p className="price">{property.price_label}</p>
                <button className="view-btn" onClick={() => onNavigate('detail', property)}>View Details</button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>😕 No properties found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Listings;