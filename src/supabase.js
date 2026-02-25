const supabaseUrl = 'https://zjeelyapynksqjkwynik.supabase.co';
const supabaseKey = 'sb_publishable_aC-v7-herXgYLMJ0YEgXUQ_0rAxdzBe';

export const fetchProperties = async () => {
  const response = await fetch(`${supabaseUrl}/rest/v1/properties?status=eq.approved&order=created_at.desc`, {
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data;
};

export const submitProperty = async (property) => {
  const response = await fetch(`${supabaseUrl}/rest/v1/properties`, {
    method: 'POST',
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(property)
  });
  return response.ok;
};