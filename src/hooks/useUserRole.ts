import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useOptimizedAuth } from './useOptimizedAuth';

export type UserRole = 'member' | 'admin' | 'super_admin';

export const useUserRole = () => {
  const { user } = useOptimizedAuth();
  const [role, setRole] = useState<UserRole>('member');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setRole('member');
      setLoading(false);
      return;
    }

    // Simple, direct fetch
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()
      .then(({ data, error }) => {
        if (data?.role) {
          setRole(data.role as UserRole);
        } else {
          setRole('member');
        }
        setLoading(false);
      })
      .catch(() => {
        setRole('member');
        setLoading(false);
      });
  }, [user?.id]);

  return {
    role,
    loading,
    isAdmin: role === 'admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin'
  };
};