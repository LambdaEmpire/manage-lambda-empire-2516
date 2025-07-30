import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';

export const RoleDebugger: React.FC = () => {
  const { user } = useOptimizedAuth();
  const { role, loading } = useUserRole();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50">
      <div>User ID: {user?.id?.substring(0, 8) || 'None'}</div>
      <div>Email: {user?.email || 'None'}</div>
      <div>Role: {loading ? 'Loading...' : role || 'None'}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
    </div>
  );
};