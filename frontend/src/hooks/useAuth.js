import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

export function useAuth() {
  const [status, setStatus] = useState(''); // surely we can seperate these field checking inside a util dir or something, this aint it lazy

  const login = async (email, password) => {
    if (!email) {
      setStatus('Email is required to login');
      return { error: new Error('Email is required') };
    }

    if (!password){
      setStatus('Password is required to login.');
      return { error: new Error('Password is required') };
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setStatus(error ? `Login failed: ${error.message}` : 'Login successful!');
    return { error };
  };

  const signup = async (email, password, username) => {
     if (!username) {
      setStatus('Username is required for signup.');
      return { error: new Error('Username is required') };
    }
    
    if (!email) {
      setStatus('Email is required for signup.');
      return { error: new Error('Email is required') };
    }
    
    if (!password) {
      setStatus('Password is required for signup.');
      return { error: new Error('Password is required') };
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    
    setStatus(error ? `Signup failed: ${error.message}` : 'Signup successful!');
    return { error };
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    setStatus(error ? `Logout failed: ${error.message}` : 'Logout successful!');
    return { error };
  };

  return {
    login,
    signup,
    logout,
    status,
    setStatus
  };
}