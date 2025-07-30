import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useOptimizedAuth } from './useOptimizedAuth';

export type UserRole = 'member' | 'admin' | 'super_admin';

// Create a singleton to prevent multiple instances from interfering
let roleCache: { [userId: string]: { role: UserRole; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useUserRole = () => {
  const { user, isAuthenticated } = useOptimizedAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const userId = user?.id;

  const fetchRole = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setRole(null);
      setLoading(false);
      return;
    }

    // Check cache first
    const cached = roleCache[userId];
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setRole(cached.role);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      let fetchedRole: UserRole = 'member';
      
      if (!error && data?.role) {
        fetchedRole = data.role as UserRole;
      }

      // Cache the result
      roleCache[userId] = {
        role: fetchedRole,
        timestamp: Date.now()
      };

      setRole(fetchedRole);
    } catch (error) {
      setRole('member');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  const hasRole = useCallback((requiredRole: UserRole | UserRole[]) => {
    if (!role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    
    return role === requiredRole;
  }, [role]);

  const isAdmin = useCallback(() => hasRole(['admin', 'super_admin']), [hasRole]);
  const isSuperAdmin = useCallback(() => hasRole('super_admin'), [hasRole]);

  return useMemo(() => ({
    role,
    loading,
    hasRole,
    isAdmin,
    isSuperAdmin
  }), [role, loading, hasRole, isAdmin, isSuperAdmin]);
};