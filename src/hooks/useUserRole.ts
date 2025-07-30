import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useOptimizedAuth } from './useOptimizedAuth';

export type UserRole = 'member' | 'admin' | 'super_admin';

let hookInstanceCount = 0;

export const useUserRole = () => {
  const { user, isAuthenticated } = useOptimizedAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [instanceId] = useState(() => ++hookInstanceCount);

  console.log(`useUserRole [${instanceId}]: Hook called, current state:`, { role, loading, userId: user?.id });

  useEffect(() => {
    console.log(`useUserRole [${instanceId}]: Effect triggered`, { 
      userId: user?.id, 
      isAuthenticated, 
      userEmail: user?.email 
    });

    const fetchUserRole = async () => {
      if (!isAuthenticated) {
        console.log(`useUserRole [${instanceId}]: Not authenticated`);
        setRole(null);
        setLoading(false);
        return;
      }

      if (!user?.id) {
        console.log(`useUserRole [${instanceId}]: No user ID, but authenticated?`, { user, isAuthenticated });
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        console.log(`useUserRole [${instanceId}]: Starting fetch for user:`, user.id);
        
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        console.log(`useUserRole [${instanceId}]: Supabase response:`, { 
          data, 
          error, 
          userId: user.id,
          timestamp: new Date().toISOString()
        });

        if (error) {
          console.error(`useUserRole [${instanceId}]: Supabase error:`, error);
          setRole('member');
        } else if (data?.role) {
          console.log(`useUserRole [${instanceId}]: Setting role to:`, data.role);
          setRole(data.role as UserRole);
        } else {
          console.log(`useUserRole [${instanceId}]: No role data found, setting to member`);
          setRole('member');
        }
      } catch (error) {
        console.error(`useUserRole [${instanceId}]: Exception:`, error);
        setRole('member');
      } finally {
        console.log(`useUserRole [${instanceId}]: Setting loading to false`);
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user?.id, isAuthenticated, instanceId]);

  const hasRole = (requiredRole: UserRole | UserRole[]) => {
    console.log(`hasRole [${instanceId}] called:`, { 
      currentRole: role, 
      requiredRole, 
      loading,
      timestamp: new Date().toISOString()
    });
    
    if (!role) {
      console.log(`hasRole [${instanceId}]: No role set, returning false`);
      return false;
    }
    
    if (Array.isArray(requiredRole)) {
      const result = requiredRole.includes(role);
      console.log(`hasRole [${instanceId}]: Array check result:`, result);
      return result;
    }
    
    const result = role === requiredRole;
    console.log(`hasRole [${instanceId}]: Single check result:`, result);
    return result;
  };

  const isAdmin = () => {
    const result = hasRole(['admin', 'super_admin']);
    console.log(`isAdmin [${instanceId}] called, result:`, result);
    return result;
  };
  
  const isSuperAdmin = () => {
    const result = hasRole('super_admin');
    console.log(`isSuperAdmin [${instanceId}] called, result:`, result);
    return result;
  };

  return {
    role,
    loading,
    hasRole,
    isAdmin,
    isSuperAdmin
  };
};