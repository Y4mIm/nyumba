import React, { useState } from "react";
import "./ListProperty.css";
import { submitProperty, uploadImage } from "./supabase";

function ListProperty({ onNavigate, user }) {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    listingType: "",
    city: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
    features: "",
    landlord: "",
    phone: "",
    whatsapp: ""
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
    if (image) {
      imageUrl = await uploadImage(image);
    }

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
      emoji: "??",
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

  if (submitted) {
    return (
      <div className="list-page">
        <nav className="navbar">
          <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Nyumba ??</h1>
          <div className="navbar-links">
            <span onClick={() => onNavigate("home")} className="nav-link">Home</span>
            <span onClick={() => onNavigate("listings")} className="nav-link">Buy</span>
            <span onClick={() => onNavigate("listings")} className="nav-link">Rent</span>
            <span onClick={() => onNavigate("list")} className="nav-link">List Property</span>
          </div>
        </nav>
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">?</div>
            <h2>Property Submitted!</h2>
            <p>Thank you <strong>{formData.landlord}</strong>! Your property listing has been received and will be reviewed within 24 hours.</p>
            <p className="success-note">We will contact you on <strong>{formData.phone}</strong> once approved.</p>
            <button className="success-btn" onClick={() => onNavigate("home")}>Back to Homepage</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="list-page">
      <nav className="navbar">
        <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Nyumba ??</h1>
        <div className="navbar-links">
          <span onClick={() => onNavigate("home")} className="nav-link">Home</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Buy</span>
          <span onClick={() => onNavigate("listings")} className="nav-link">Rent</span>
          <span onClick={() => onNavigate("list")} className="nav-link">List Property</span>
        </div>
      </nav>

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
                  <span className="upload-icon">??</span>
                  <span>Click to upload a photo</span>
                  <span className="upload-hint">Max 5MB � JPG, PNG</span>
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
            <p>??? By submitting this form you confirm that you are the owner or authorized agent for this property.</p>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Listing for Review"}
          </button>

        </form>
      </div>

      <footer className="footer">
        <p>� 2026 Nyumba � Built for Malawi ????</p>
      </footer>

    </div>
  );
}

export default ListProperty;
