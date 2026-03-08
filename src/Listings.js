import React, { useState, useEffect } from 'react';
import './Listings.css';
import { fetchProperties, getSavedProperties, saveProperty, unsaveProperty } from './supabase';

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

function Listings({ onNavigate, onBack, user, token, currentPage }) {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');
  const [savedIds, setSavedIds] = useState([]);

  useEffect(() => {
    loadProperties();
    if (user) loadSaved();
  }, [user]);

  const loadProperties = async () => {
    setLoading(true);
    const data = await fetchProperties();
    if (Array.isArray(data)) setAllProperties(data);
    setLoading(false);
  };

  const loadSaved = async () => {
    const ids = await getSavedProperties(user.id, token);
    setSavedIds(ids);
  };

  const toggleSave = async (propertyId) => {
    if (!user) { onNavigate('auth'); return; }
    if (savedIds.includes(propertyId)) {
      await unsaveProperty(user.id, propertyId, token);
      setSavedIds(savedIds.filter(id => id !== propertyId));
    } else {
      await saveProperty(user.id, propertyId, token);
      setSavedIds([...savedIds, propertyId]);
    }
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
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={onBack} style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#111827',
              padding: '5px 12px',
              borderRadius: '10px',
              lineHeight: 1,
              fontWeight: '600'
            }}>&#8592;</button>
            <h1 onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Nyumba</h1>
          </div>
          <div className="navbar-links">
            <a href="#" onClick={() => onNavigate('home')}>Home</a>
            <a href="#" onClick={() => onNavigate('listings')}>Buy</a>
            <a href="#" onClick={() => onNavigate('listings')}>Rent</a>
            <a href="#" onClick={() => onNavigate('list')}>List Property</a>
            {user ? (
              <a href="#" onClick={() => onNavigate('saved')}>Saved</a>
            ) : (
              <a href="#" onClick={() => onNavigate('auth')}>Login</a>
            )}
          </div>
        </div>
      </nav>

      <div className="listings-header">
        <div className="listings-header-inner">
          <h2>Properties in Blantyre & Lilongwe</h2>
          <p>Find your perfect home from our verified listings</p>
        </div>
      </div>

      <div className="filters">
        <div className="filters-inner">
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
      </div>

      <div className="results-count">
        <div className="results-count-inner">
          {loading ? 'Loading properties...' : (
            <>Showing <strong>{filtered.length}</strong> properties
            {city !== 'All' && ` in ${city}`}
            {type !== 'All' && ` · ${type === 'rent' ? 'For Rent' : 'For Sale'}`}</>
          )}
        </div>
      </div>

      <div className="listings-grid">
        {loading ? (
          <div className="no-results"><p>Loading properties...</p></div>
        ) : filtered.length > 0 ? (
          filtered.map(property => (
            <div className="card" key={property.id}>
              <div className="card-img">
                {property.image_url ? (
                  <img src={property.image_url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  property.emoji
                )}
                <button
                  className={'save-btn ' + (savedIds.includes(property.id) ? 'saved' : '')}
                  onClick={() => toggleSave(property.id)}
                >
                  {savedIds.includes(property.id) ? '❤️' : '🤍'}
                </button>
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
            <p>No properties found. Try adjusting your filters.</p>
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <div className={`bottom-nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => onNavigate('home')}>
          <HomeIcon />
          <span>Home</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'listings' ? 'active' : ''}`} onClick={() => onNavigate('listings')}>
          <SearchIcon />
          <span>Search</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'list' ? 'active' : ''}`} onClick={() => onNavigate('list')}>
          <PlusIcon />
          <span>List</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'saved' ? 'active' : ''}`} onClick={() => onNavigate(user ? 'saved' : 'auth')}>
          <HeartIcon />
          <span>Saved</span>
        </div>
        <div className={`bottom-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate(user ? 'dashboard' : 'auth')}>
          <UserIcon />
          <span>{user ? 'Profile' : 'Login'}</span>
        </div>
      </div>

    </div>
  );
}

export default Listings;