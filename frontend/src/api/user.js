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

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient('/api/v1/users/avatar', {
      method: 'POST',
      body: formData
    });
  },

  updateProfile: async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');
    
    const { data, error } = await supabase
      .from('Users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return { data, error: null };
  },

  changePassword: async (newPassword) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    
    if (error) throw error;
    return { data, error: null };
  },

  deleteAccount: async () => {
    // Backend will clear history, then delete from Auth
    await apiClient('/api/v1/users/account', {
      method: 'DELETE'
    });

    // Sign out the user
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;

    return { data: null, error: null };
  }
};