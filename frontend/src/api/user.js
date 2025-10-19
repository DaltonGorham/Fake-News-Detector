import { apiClient } from './client';
import { supabase } from '../lib/supabaseClient';


export const userApi = {
  // Direct supabase queries is ok for fetching profile data
  // since its handled with RLS and user's jwt
  getProfile: async () => {
    const { data, error } = await supabase
    .from('Users') 
    .select('username, avatar_url')
    .single();
    if (error) throw error;
    return { data, error: null };
  },


  // keep this on the backend API
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient('/api/v1/users/avatar', {
      method: 'POST',
      body: formData
    });
  },

  // needs to update both auth metadata and Users table
  // this will further expanded in the profile settings
  updateProfile: async (updates) => {
    const { data, error } = await supabase
      .from('Users')
      .update(updates)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  }
};