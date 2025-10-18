import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { userApi } from '../api/user';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const { data, error } = await userApi.getProfile();
        
        if (error) throw error;
        
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const refreshProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await userApi.getProfile();
      
      if (error) throw error;
      
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refreshProfile
  };
}