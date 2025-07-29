import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Cache for user sessions to reduce database calls
const sessionCache = new Map<string, { session: Session; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useOptimizedAuth = () => {
  const [user, setUser] = useState<User | null>(null);
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

  // Optimized session check with caching
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
      }

      setSession(session);
      setUser(session?.user ?? null);
      setError(null);
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Authentication check failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized sign out with cache cleanup
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear cache for current user
      if (user?.id) {
        sessionCache.delete(user.id);
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
    // Check for cached session first
    const cachedSession = user?.id ? sessionCache.get(user.id) : null;
    const isCacheValid = cachedSession && 
      (Date.now() - cachedSession.timestamp) < CACHE_DURATION;

    if (isCacheValid) {
      setSession(cachedSession.session);
      setUser(cachedSession.session.user);
      setLoading(false);
      return;
    }

    // Set up auth state listener with debouncing
    let timeoutId: NodeJS.Timeout;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);

          // Cache new session
          if (session) {
            sessionCache.set(session.user.id, {
              session,
              timestamp: Date.now()
            });
          }
        }, 100); // Debounce auth state changes
      }
    );

    // Initial session check
    checkSession();

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [checkSession, user?.id]);

  // Cleanup expired cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of sessionCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          sessionCache.delete(key);
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