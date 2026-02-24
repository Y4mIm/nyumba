import React, { useState } from 'react';
import './Listings.css';

const allProperties = [
  {
    id: 1, emoji: "🏡", badge: "rent", label: "For Rent",
    title: "3 Bedroom House", location: "Area 47, Lilongwe", city: "Lilongwe",
    bedrooms: 3, bathrooms: 2, size: 180, price: 180000, priceLabel: "MWK 180,000 / month",
    landlord: "Mr. Banda", landlordType: "Private Landlord",
    phone: "+265991234567", whatsapp: "265991234567",
    description: "A spacious and well maintained 3 bedroom house located in the quiet and secure Area 47 neighborhood of Lilongwe. The house features a large living room, modern kitchen, and a beautiful garden. Ideal for a small family.",
    features: ["Garden", "Parking", "Security Guard", "Borehole Water", "ESCOM Connection", "Perimeter Wall"]
  },
  {
    id: 2, emoji: "🏢", badge: "sale", label: "For Sale",
    title: "2 Bedroom Apartment", location: "Limbe, Blantyre", city: "Blantyre",
    bedrooms: 2, bathrooms: 1, size: 95, price: 45000000, priceLabel: "MWK 45,000,000",
    landlord: "Sunrise Properties", landlordType: "Real Estate Agency",
    phone: "+265881234567", whatsapp: "265881234567",
    description: "A modern 2 bedroom apartment in the heart of Limbe, Blantyre. Perfect for young professionals or investors. The apartment is located in a secure building with 24 hour security and reliable water and electricity supply.",
    features: ["24hr Security", "Reliable Water", "ESCOM Connection", "Tiled Floors", "Modern Kitchen", "Close to Market"]
  },
  {
    id: 3, emoji: "🏠", badge: "rent", label: "For Rent",
    title: "4 Bedroom House", location: "Nyambadwe, Blantyre", city: "Blantyre",
    bedrooms: 4, bathrooms: 2, size: 220, price: 250000, priceLabel: "MWK 250,000 / month",
    landlord: "Mrs. Phiri", landlordType: "Private Landlord",
    phone: "+265991112233", whatsapp: "265991112233",
    description: "A large 4 bedroom house in the prestigious Nyambadwe area of Blantyre. The property sits on a large plot with a well maintained garden and offers stunning views of the Blantyre hills.",
    features: ["Garden", "Garage", "Borehole", "Solar Power", "Perimeter Wall", "Servants Quarters"]
  },
  {
    id: 4, emoji: "🏡", badge: "sale", label: "For Sale",
    title: "5 Bedroom Villa", location: "Salima Road, Lilongwe", city: "Lilongwe",
    bedrooms: 5, bathrooms: 3, size: 350, price: 120000000, priceLabel: "MWK 120,000,000",
    landlord: "Capital Real Estate", landlordType: "Real Estate Agency",
    phone: "+265881122334", whatsapp: "265881122334",
    description: "A stunning 5 bedroom villa on Salima Road, Lilongwe. This luxurious property features high end finishes throughout, a large swimming pool, and beautifully landscaped gardens. A rare find in Malawi.",
    features: ["Swimming Pool", "Large Garden", "Double Garage", "Solar Power", "Borehole", "Staff Quarters", "CCTV Security"]
  },
  {
    id: 5, emoji: "🏘️", badge: "rent", label: "For Rent",
    title: "1 Bedroom Flat", location: "Chirimba, Blantyre", city: "Blantyre",
    bedrooms: 1, bathrooms: 1, size: 55, price: 75000, priceLabel: "MWK 75,000 / month",
    landlord: "Mr. Mwale", landlordType: "Private Landlord",
    phone: "+265993344556", whatsapp: "265993344556",
    description: "An affordable and clean 1 bedroom flat in Chirimba, Blantyre. Ideal for a single professional or couple. Close to public transport, shops and the main road.",
    features: ["Close to Transport", "Tiled Floors", "ESCOM Connection", "Water Supply", "Secure Yard"]
  },
  {
    id: 6, emoji: "🏠", badge: "rent", label: "For Rent",
    title: "2 Bedroom House", location: "Area 25, Lilongwe", city: "Lilongwe",
    bedrooms: 2, bathrooms: 1, size: 110, price: 130000, priceLabel: "MWK 130,000 / month",
    landlord: "Ms. Tembo", landlordType: "Private Landlord",
    phone: "+265994455667", whatsapp: "265994455667",
    description: "A neat and affordable 2 bedroom house in Area 25, Lilongwe. The property is in a friendly neighborhood close to schools, shops and public transport links.",
    features: ["Garden", "Parking", "ESCOM Connection", "Borehole Water", "Close to Schools"]
  },
  {
    id: 7, emoji: "🏢", badge: "sale", label: "For Sale",
    title: "3 Bedroom Apartment", location: "Mandala, Blantyre", city: "Blantyre",
    bedrooms: 3, bathrooms: 2, size: 140, price: 68000000, priceLabel: "MWK 68,000,000",
    landlord: "Blantyre Homes Ltd", landlordType: "Property Company",
    phone: "+265882233445", whatsapp: "265882233445",
    description: "A well finished 3 bedroom apartment in the sought after Mandala area of Blantyre. The apartment is located in a secure complex with ample parking and reliable utilities.",
    features: ["Secure Complex", "Parking", "Modern Finishes", "Reliable Water", "ESCOM Connection", "Close to CBD"]
  },
  {
    id: 8, emoji: "🏡", badge: "rent", label: "For Rent",
    title: "3 Bedroom House", location: "Area 43, Lilongwe", city: "Lilongwe",
    bedrooms: 3, bathrooms: 2, size: 160, price: 200000, priceLabel: "MWK 200,000 / month",
    landlord: "Mr. Chirwa", landlordType: "Private Landlord",
    phone: "+265995566778", whatsapp: "265995566778",
    description: "A comfortable 3 bedroom house in Area 43, one of Lilongwe's most popular residential areas. The house is well maintained with a good sized garden and reliable water and electricity.",
    features: ["Garden", "Parking", "Borehole", "ESCOM", "Perimeter Wall", "Close to Shops"]
  },
  {
    id: 9, emoji: "🏘️", badge: "sale", label: "For Sale",
    title: "4 Bedroom House", location: "Sunnyside, Blantyre", city: "Blantyre",
    bedrooms: 4, bathrooms: 2, size: 200, price: 85000000, priceLabel: "MWK 85,000,000",
    landlord: "Southern Properties", landlordType: "Real Estate Agency",
    phone: "+265883344556", whatsapp: "265883344556",
    description: "A solid 4 bedroom family home in the leafy Sunnyside suburb of Blantyre. The property is set on a large plot with mature trees and a spacious garden. A great investment opportunity.",
    features: ["Large Plot", "Mature Garden", "Garage", "Borehole", "Servants Quarters", "Quiet Neighborhood"]
  },
  {
    id: 10, emoji: "🏠", badge: "rent", label: "For Rent",
    title: "2 Bedroom Flat", location: "Area 10, Lilongwe", city: "Lilongwe",
    bedrooms: 2, bathrooms: 1, size: 90, price: 95000, priceLabel: "MWK 95,000 / month",
    landlord: "Mr. Nyirenda", landlordType: "Private Landlord",
    phone: "+265996677889", whatsapp: "265996677889",
    description: "A clean and well located 2 bedroom flat in Area 10, close to the city centre of Lilongwe. Suitable for young professionals or small families looking for affordable city living.",
    features: ["City Centre Location", "Tiled Floors", "Water Supply", "ESCOM", "Secure Building"]
  },
  {
    id: 11, emoji: "🏡", badge: "sale", label: "For Sale",
    title: "3 Bedroom House", location: "Naperi, Blantyre", city: "Blantyre",
    bedrooms: 3, bathrooms: 2, size: 150, price: 55000000, priceLabel: "MWK 55,000,000",
    landlord: "Mr. Kamanga", landlordType: "Private Landlord",
    phone: "+265997788990", whatsapp: "265997788990",
    description: "A well built 3 bedroom house in Naperi, Blantyre. This property offers good value for money with solid construction, reliable utilities and a convenient location close to schools and markets.",
    features: ["Garden", "Parking", "Borehole", "ESCOM Connection", "Close to Schools", "Perimeter Wall"]
  },
  {
    id: 12, emoji: "🏢", badge: "rent", label: "For Rent",
    title: "1 Bedroom Apartment", location: "Area 3, Lilongwe", city: "Lilongwe",
    bedrooms: 1, bathrooms: 1, size: 60, price: 60000, priceLabel: "MWK 60,000 / month",
    landlord: "Capital Apartments", landlordType: "Property Company",
    phone: "+265884455667", whatsapp: "265884455667",
    description: "A modern and affordable 1 bedroom apartment in Area 3, right in the heart of Lilongwe. Perfect for a single professional. The building has 24 hour security and is walking distance from shops and offices.",
    features: ["24hr Security", "Modern Finishes", "Water Supply", "ESCOM", "Walking Distance to Shops"]
  },
];

function Listings({ onNavigate }) {
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');
  const [type, setType] = useState('All');
  const [bedrooms, setBedrooms] = useState('All');

  const filtered = allProperties.filter(p => {
    const matchSearch = p.location.toLowerCase().includes(search.toLowerCase()) || p.title.toLowerCase().includes(search.toLowerCase());
    const matchCity = city === 'All' || p.city === city;
    const matchType = type === 'All' || p.badge === type;
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
          <a href="#">List Property</a>
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
        Showing <strong>{filtered.length}</strong> properties
        {city !== 'All' && ` in ${city}`}
        {type !== 'All' && ` · ${type === 'rent' ? 'For Rent' : 'For Sale'}`}
      </div>

      <div className="listings-grid">
        {filtered.length > 0 ? (
          filtered.map(property => (
            <div className="card" key={property.id}>
              <div className="card-img">{property.emoji}</div>
              <div className="card-info">
                <span className={`badge ${property.badge}`}>{property.label}</span>
                <h3>{property.title}</h3>
                <p>📍 {property.location}</p>
                <p>🛏️ {property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</p>
                <p className="price">{property.priceLabel}</p>
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