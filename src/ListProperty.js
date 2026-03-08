import React, { useState } from "react";
import "./ListProperty.css";
import { submitProperty, uploadImage } from "./supabase";

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

function ListProperty({ onNavigate, onBack, user, currentPage }) {
  const [formData, setFormData] = useState({
    title: "", type: "", listingType: "", city: "", location: "",
    price: "", bedrooms: "", bathrooms: "", size: "", description: "",
    features: "", landlord: "", phone: "", whatsapp: ""
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image is too large. Please upload an image under 5MB.");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let imageUrl = null;
    if (image) imageUrl = await uploadImage(image);
    const propertyData = {
      title: formData.title,
      type: formData.type,
      listing_type: formData.listingType,
      city: formData.city,
      location: formData.location + ", " + formData.city,
      price: parseInt(formData.price),
      price_label: "MWK " + parseInt(formData.price).toLocaleString() + (formData.listingType === "rent" ? " / month" : ""),
      size: parseInt(formData.size) || 0,
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      description: formData.description,
      features: formData.features,
      landlord: formData.landlord,
      landlord_email: user ? user.email : null,
      phone: formData.phone,
      whatsapp: formData.whatsapp.replace("+", ""),
      emoji: "🏠",
      image_url: imageUrl,
      status: "pending"
    };
    const success = await submitProperty(propertyData);
    if (success) {
      setSubmitted(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
    window.scrollTo(0, 0);
  };

  const NavBar = () => (
    <nav className="navbar">
      <div className="navbar-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={onBack} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "20px", color: "#111827", padding: "5px 12px",
            borderRadius: "10px", lineHeight: 1, fontWeight: "600"
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
  );

  const BottomNav = () => (
    <div className="bottom-nav">
      <div className={`bottom-nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => onNavigate("home")}>
        <HomeIcon /><span>Home</span>
      </div>
      <div className={`bottom-nav-item ${currentPage === 'listings' ? 'active' : ''}`} onClick={() => onNavigate("listings")}>
        <SearchIcon /><span>Search</span>
      </div>
      <div className={`bottom-nav-item ${currentPage === 'list' ? 'active' : ''}`} onClick={() => onNavigate("list")}>
        <PlusIcon /><span>List</span>
      </div>
      <div className={`bottom-nav-item ${currentPage === 'saved' ? 'active' : ''}`} onClick={() => onNavigate(user ? "saved" : "auth")}>
        <HeartIcon /><span>Saved</span>
      </div>
      <div className={`bottom-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`} onClick={() => onNavigate(user ? "dashboard" : "auth")}>
        <UserIcon /><span>{user ? "Profile" : "Login"}</span>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="list-page">
        <NavBar />
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">✅</div>
            <h2>Property Submitted!</h2>
            <p>Thank you <strong>{formData.landlord}</strong>! Your property listing has been received and will be reviewed within 24 hours.</p>
            <p className="success-note">We will contact you on <strong>{formData.phone}</strong> once approved.</p>
            <button className="success-btn" onClick={() => onNavigate("home")}>Back to Homepage</button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="list-page">
      <NavBar />

      <div className="list-header">
        <h2>List Your Property</h2>
        <p>Fill in the details below and we will publish your listing within 24 hours</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>

          <div className="form-section">
            <h3>Property Photo</h3>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button type="button" className="remove-image" onClick={() => { setImage(null); setImagePreview(null); }}>Remove</button>
                </div>
              ) : (
                <label className="image-upload-label">
                  <span className="upload-icon">📷</span>
                  <span>Click to upload a photo</span>
                  <span className="upload-hint">Max 5MB · JPG, PNG</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                </label>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Property Details</h3>
            <div className="form-group">
              <label>Property Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. 3 Bedroom House in Area 47" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Property Type</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="">Select type</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Flat">Flat</option>
                  <option value="Villa">Villa</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Listing Type</label>
                <select name="listingType" value={formData.listingType} onChange={handleChange} required>
                  <option value="">Select listing type</option>
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <select name="city" value={formData.city} onChange={handleChange} required>
                  <option value="">Select city</option>
                  <option value="Blantyre">Blantyre</option>
                  <option value="Lilongwe">Lilongwe</option>
                </select>
              </div>
              <div className="form-group">
                <label>Area / Neighborhood</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. Area 47, Limbe" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Price (MWK)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 150000" required />
              </div>
              <div className="form-group">
                <label>Size (sqm)</label>
                <input type="number" name="size" value={formData.size} onChange={handleChange} placeholder="e.g. 150" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Bedrooms</label>
                <select name="bedrooms" value={formData.bedrooms} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <select name="bathrooms" value={formData.bathrooms} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe your property..." rows="4" required />
            </div>
            <div className="form-group">
              <label>Features</label>
              <input type="text" name="features" value={formData.features} onChange={handleChange} placeholder="e.g. Garden, Parking, Borehole" />
              <span className="input-hint">Separate features with commas</span>
            </div>
          </div>

          <div className="form-section">
            <h3>Your Contact Details</h3>
            <div className="form-group">
              <label>Your Name</label>
              <input type="text" name="landlord" value={formData.landlord} onChange={handleChange} placeholder="e.g. Mr. Banda or Sunrise Properties" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g. +265991234567" required />
              </div>
              <div className="form-group">
                <label>WhatsApp Number</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="e.g. 265991234567" required />
              </div>
            </div>
          </div>

          <div className="form-note">
            <p>✅ By submitting this form you confirm that you are the owner or authorized agent for this property.</p>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Listing for Review"}
          </button>

        </form>
      </div>

      <footer className="footer">
        <p>&copy; 2026 Nyumba &middot; Built for Malawi</p>
      </footer>

      <BottomNav />
    </div>
  );
}

export default ListProperty;