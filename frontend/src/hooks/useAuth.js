import { useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { validateEmail, validatePassword, validateUsername } from '../util/validator.js';
import { getRedirectURL } from '../util/auth.js';

export function useAuth() {
  const [status, setStatus] = useState('');
  const [pendingEmailVerification, setPendingEmailVerification] = useState(null);

  const handleError = (error, prefix = '') => {
    const message = error?.message || 'An unexpected error occurred';
    setStatus(`${prefix}${message}`);
    return { error };
  };

  const login = async (email, password) => {
    try {
      validateEmail(email);
      validatePassword(password);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          redirectTo: getRedirectURL()
        }
      });

      if (error) {
        return handleError(error, 'Login failed: ');
      }

      if (!data.user?.confirmed_at) {
        setPendingEmailVerification(email);
        setStatus('Please confirm your email before logging in.');
        return { error: new Error('Email not confirmed') };
      }

      setStatus('Login successful!');
      return { data, error: null };
    } catch (err) {
      return handleError(err);
    }
  };

  const signup = async (email, password, username) => {
    try {
      validateUsername(username);
      validateEmail(email);
      validatePassword(password);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${window.location.origin}/verify`,
        }
      });

      if (error) {
        return handleError(error, 'Signup failed: ');
      }

      setPendingEmailVerification(email);
      setStatus('')
      return { data, error: null };
    } catch (err) {
      return handleError(err);
    }
  };

  const resendVerificationEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: { redirectTo: `${window.location.origin}/verify` }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return handleError(error, 'Logout failed: ');
      }
      setStatus('Logout successful!');
      return { error: null };
    } catch (err) {
      return handleError(err);
    }
  };

  return {
    login,
    signup,
    logout,
    resendVerificationEmail,
    status,
    setStatus,
    pendingEmailVerification,
    setPendingEmailVerification
  };
}