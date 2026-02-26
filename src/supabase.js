const SUPABASE_URL = 'https://zjeelyapynksqjkwynik.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aC-v7-herXgYLMJ0YEgXUQ_0rAxdzBe';

export const fetchProperties = async () => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/properties?status=eq.approved&order=created_at.desc`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
};

export const submitProperty = async (property) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/properties`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(property)
  });
  return response.ok;
};

export const uploadImage = async (file) => {
  const filename = Date.now() + '-' + file.name.replace(/\s/g, '-');
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/property-images/${filename}`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': file.type,
      'x-upsert': 'true'
    },
    body: file
  });
  const result = await response.json();
  if (response.ok) {
    return `${SUPABASE_URL}/storage/v1/object/public/property-images/${filename}`;
  }
  console.error('Upload failed:', result);
  return null;
};

export const getSavedProperties = async (userId, token) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_properties?user_id=eq.${userId}&select=property_id`, {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return Array.isArray(data) ? data.map(d => d.property_id) : [];
};

export const saveProperty = async (userId, propertyId, token) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_properties`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ user_id: userId, property_id: propertyId })
  });
  return response.ok;
};

export const unsaveProperty = async (userId, propertyId, token) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_properties?user_id=eq.${userId}&property_id=eq.${propertyId}`, {
    method: 'DELETE',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.ok;
};