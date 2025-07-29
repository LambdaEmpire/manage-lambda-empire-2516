import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Cache for user sessions and profiles to reduce database calls
const sessionCache = new Map<string, { session: Session; timestamp: number }>();
const profileCache = new Map<string, { profile: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
}

interface ExtendedUser extends User {
  first_name?: string | null;
  last_name?: string | null;
}

export const useOptimizedAuth = () => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized auth state to prevent unnecessary re-renders
  const authState = useMemo(() => ({
    user,
    session,
    loading,
    error,
    isAuthenticated: !!user
  }), [user, session, loading, error]);

  // Fetch user profile data
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      // Check cache first
      const cachedProfile = profileCache.get(userId);
      const isCacheValid = cachedProfile && 
        (Date.now() - cachedProfile.timestamp) < CACHE_DURATION;

      if (isCacheValid) {
        return cachedProfile.profile;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Profile fetch error:', error);
        return null;
      }

      // Cache the profile
      if (profile) {
        profileCache.set(userId, {
          profile,
          timestamp: Date.now()
        });
      }

      return profile;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  }, []);

  // Optimized session check with caching and profile loading
  const checkSession = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        setError(error.message);
        return;
      }

      if (session) {
        // Cache the session
        sessionCache.set(session.user.id, {
          session,
          timestamp: Date.now()
        });

        // Fetch and merge profile data
        const profile = await fetchUserProfile(session.user.id);
        const extendedUser: ExtendedUser = {
          ...session.user,
          first_name: profile?.first_name || null,
          last_name: profile?.last_name || null
        };

        setUser(extendedUser);
      } else {
        setUser(null);
      }

      setSession(session);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  // Optimized sign out with cache cleanup
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear cache for current user
      if (user?.id) {
        sessionCache.delete(user.id);
        profileCache.delete(user.id);
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setError(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError('Sign out failed');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // Set up auth state listener with debouncing
    let timeoutId: NodeJS.Timeout;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          setSession(session);
          
          if (session) {
            // Cache new session
            sessionCache.set(session.user.id, {
              session,
              timestamp: Date.now()
            });

            // Fetch and merge profile data
            const profile = await fetchUserProfile(session.user.id);
            const extendedUser: ExtendedUser = {
              ...session.user,
              first_name: profile?.first_name || null,
              last_name: profile?.last_name || null
            };
            setUser(extendedUser);
          } else {
            setUser(null);
          }
          
          setLoading(false);
          setError(null);
        }, 100); // Debounce auth state changes
      }
    );

    // Initial session check
    checkSession();

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [checkSession, fetchUserProfile]);

  // Cleanup expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of sessionCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          sessionCache.delete(key);
        }
      }
      for (const [key, value] of profileCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          profileCache.delete(key);
        }
      }
    }, CACHE_DURATION);

    return () => clearInterval(cleanupInterval);
  }, []);

  return {
    ...authState,
    signOut,
    refreshSession: checkSession
  };
};