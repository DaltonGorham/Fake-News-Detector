import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { validateEmail, validatePassword, validateUsername } from '../util/validator.js';
import { getRedirectURL } from '../util/auth.js';

export function useAuth() {
  const [status, setStatus] = useState('');

  const login = async (email, password) => {
    try {
      validateEmail(email);
      validatePassword(password);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      }, {
        redirectTo: getRedirectURL(),
      });

      setStatus(error ? `Login failed: ${error.message}` : 'Login successful!');
      return { error };
    } catch (err) {
      setStatus(err.message);
      return { error: err };
    }
  };

  const signup = async (email, password, username) => {
    try {
      validateUsername(username);
      validateEmail(email);
      validatePassword(password);

      const { error } = await supabase.auth.signUp({
        email,
        password,
      }, {
        redirectTo: getRedirectURL(),
      });

      setStatus(error ? `Signup failed: ${error.message}` : 'Signup successful!');
      return { error };
    } catch (err) {
      setStatus(err.message);
      return { error: err };
    }
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
    setStatus,
  };
}
