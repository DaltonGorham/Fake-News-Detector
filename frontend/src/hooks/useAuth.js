import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { validateEmail, validatePassword, validateUsername } from '../util/validator.js';
import { getRedirectURL, formatAuthError } from '../util/authUtils.js';

/**
 * CACHING STRATEGY (Generated with AI assistance)
 * 
 * This caching solution helps prevent multiple API calls when useAuth() is called
 * by multiple components simultaneously. By deduplicating in-flight requests with
 * initPromise, we ensure only one /auth/v1/user API call happens at a time.
 */
const userCache = {
  user: null,
  isInitialized: false,
  initPromise: null
};

export function useAuth() {
  const [status, setStatus] = useState('');
  const [pendingEmailVerification, setPendingEmailVerification] = useState(null);
  const [user, setUser] = useState(userCache.user);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      if (userCache.isInitialized) {
        return;
      }

      if (userCache.initPromise) {
        try {
          const userData = await userCache.initPromise;
          if (isMounted) {
            setUser(userData);
          }
        } catch (err) {
          console.error('Auth error:', err);
        }
        return;
      }

      const initPromise = supabase.auth.getUser().then(({ data: { user } }) => {
        userCache.user = user;
        if (isMounted) {
          setUser(user);
        }
        return user;
      }).catch((err) => {
        console.error('Auth error:', err);
        throw err;
      }).finally(() => {
        userCache.isInitialized = true;
        hasInitializedRef.current = true;
      });

      userCache.initPromise = initPromise;
      return initPromise;
    };

    initializeAuth();

    // Listen for auth state changes (login, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const newUser = session?.user ?? null;
      userCache.user = newUser;
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