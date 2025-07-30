import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useOptimizedAuth } from './useOptimizedAuth';

export type UserRole = 'member' | 'admin' | 'super_admin';

export const useUserRole = () => {
  const { user, isAuthenticated } = useOptimizedAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useUserRole: Effect triggered', { 
      userId: user?.id, 
      isAuthenticated, 
      userEmail: user?.email 
    });

    const fetchUserRole = async () => {
      if (!isAuthenticated) {
        console.log('useUserRole: Not authenticated');
        setRole(null);
        setLoading(false);
        return;
      }

      if (!user?.id) {
        console.log('useUserRole: No user ID, but authenticated?', { user, isAuthenticated });
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log('useUserRole: Starting fetch for user:', user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log('useUserRole: Supabase response:', { 
          data, 
          error, 
          userId: user.id,
          timestamp: new Date().toISOString()
        });

        if (error) {
          console.error('useUserRole: Supabase error:', error);
          setRole('member');
        } else if (data?.role) {
          console.log('useUserRole: Setting role to:', data.role);
          setRole(data.role as UserRole);
        } else {
          console.log('useUserRole: No role data found, setting to member');
          setRole('member');
        }
      } catch (error) {
        console.error('useUserRole: Exception:', error);
        setRole('member');
      } finally {
        console.log('useUserRole: Setting loading to false');
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id, isAuthenticated]); // Added isAuthenticated to dependencies

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    console.log('hasRole called:', { 
      currentRole: role, 
      requiredRole, 
      loading,
      timestamp: new Date().toISOString()
    });
    
    if (!role) {
      console.log('hasRole: No role set, returning false');
      return false;
    }
    
    if (Array.isArray(requiredRole)) {
      const result = requiredRole.includes(role);
      console.log('hasRole: Array check result:', result);
      return result;
    }
    
    const result = role === requiredRole;
    console.log('hasRole: Single check result:', result);
    return result;
  };

  const isAdmin = () => {
    const result = hasRole(['admin', 'super_admin']);
    console.log('isAdmin called, result:', result);
    return result;
  };
  
  const isSuperAdmin = () => {
    const result = hasRole('super_admin');
    console.log('isSuperAdmin called, result:', result);
    return result;
  };

  console.log('useUserRole: Current state:', { role, loading, userId: user?.id });

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
};