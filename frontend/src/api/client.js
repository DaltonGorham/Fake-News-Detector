import { supabase } from '../lib/supabaseClient';

// Base URL for the API, configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeader = async () => {
  const session = await supabase.auth.getSession();
  if (session?.data?.session?.access_token) {
    return { Authorization: `Bearer ${session.data.session.access_token}` };
  }
  return null;
};

export const apiClient = async (endpoint, options = {}) => {
  try {
    
    const headers = {
      'Content-Type': 'application/json'
    };

    const authHeader = await getAuthHeader();
    if (authHeader) {
      headers.Authorization = authHeader.Authorization;
    }

    if (options.headers) {
      Object.keys(options.headers).forEach(key => {
        headers[key] = options.headers[key];
      });
    }

    const requestConfig = {
      method: options.method || 'GET',
      headers: headers
    };

    if (options.body) {
      requestConfig.body = options.body;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, requestConfig);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { data: null, error: error.message };
  }
};