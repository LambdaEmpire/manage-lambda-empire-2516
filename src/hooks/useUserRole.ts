import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useOptimizedAuth } from './useOptimizedAuth';

export type UserRole = 'member' | 'admin' | 'super_admin';

export const useUserRole = () => {
  const { user, isAuthenticated } = useOptimizedAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRole = async () => {
      if (!isAuthenticated || !user?.id) {
        if (isMounted) {
          setRole(null);
          setLoading(false);
        }
        return;
      }

      try {
        // Use the exact same query that works in the manual test
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (isMounted) {
          if (error) {
            console.error('Role fetch error:', error);
            setRole('member');
          } else if (data?.role) {
            console.log('Role fetched successfully:', data.role);
            setRole(data.role as UserRole);
          } else {
            console.log('No role found, defaulting to member');
            setRole('member');
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Role fetch exception:', error);
        if (isMounted) {
          setRole('member');
          setLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [user?.id, isAuthenticated]);

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    if (!role) return false;
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(role);
    }
    
    return role === requiredRole;
  };

  const isAdmin = () => hasRole(['admin', 'super_admin']);
  const isSuperAdmin = () => hasRole('super_admin');

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
};