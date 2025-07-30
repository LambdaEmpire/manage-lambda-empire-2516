import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useOptimizedAuth } from './useOptimizedAuth';

export type UserRole = 'member' | 'admin' | 'super_admin';

export const useUserRole = () => {
  const { user } = useOptimizedAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user?.id) {
        console.log('useUserRole: No user ID');
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('useUserRole: Fetching role for user:', user.id);
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('useUserRole: Error fetching user role:', error);
          setRole('member'); // Default to member if no role found
        } else {
          console.log('useUserRole: Fetched role:', data.role);
          setRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('useUserRole: Exception fetching user role:', error);
        setRole('member');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id]);

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    if (!role) {
      console.log('hasRole: No role set');
      return false;
    }
    
    if (Array.isArray(requiredRole)) {
      const result = requiredRole.includes(role);
      console.log('hasRole: Checking array', { role, requiredRole, result });
      return result;
    }
    
    const result = role === requiredRole;
    console.log('hasRole: Checking single', { role, requiredRole, result });
    return result;
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