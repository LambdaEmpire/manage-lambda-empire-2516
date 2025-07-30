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
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('member'); // Default to member if no role found
        } else {
          setRole(data.role as UserRole);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('member');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id]);

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