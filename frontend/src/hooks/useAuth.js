import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { validateEmail, validatePassword, validateUsername } from '../util/validator.js';
import { getRedirectURL, formatAuthError } from '../util/authUtils.js';
import { createCache, cachedFetch, resetCache } from '../util/cacheManager.js';

const userCache = createCache(null);

export function useAuth() {
  const [status, setStatus] = useState('');
  const [pendingEmailVerification, setPendingEmailVerification] = useState(null);
  const [user, setUser] = useState(userCache.data);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (userCache.isInitialized) {
        return;
      }

      try {
        await cachedFetch(
          userCache,
          async () => {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
          },
          {
            onSuccess: (userData) => {
              if (isMounted) {
                setUser(userData);
                hasInitializedRef.current = true;
              }
            },
            onError: (err) => {
              console.error('Auth error:', err);
            }
          }
        );
      } catch (err) {
        console.error('Auth initialization error:', err);
      }
    };

    initializeAuth();

    // Listen for auth state changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      userCache.data = newUser;
      if (isMounted) {
        setUser(newUser);
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleError = (error, prefix = '') => {
    const message = formatAuthError(error);
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
        // Handle unique constraint violation from database trigger
        if (error.message?.includes('users_username_unique') || 
            error.message?.includes('duplicate key') ||
            error.message?.includes('Database error saving new user')) {
          return handleError(new Error(`${username} is already taken`), '');
        }
        return handleError(error, 'Signup failed: ');
      }

      // Supabase returns user even if email exists 
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return handleError(new Error('Email already registered'), '');
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
    user,
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