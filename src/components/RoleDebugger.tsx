import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';

export const RoleDebugger: React.FC = () => {
  const { user, isAuthenticated } = useOptimizedAuth();
  const { role, loading, isAdmin, isSuperAdmin } = useUserRole();

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50">
      <div className="font-bold mb-2">Simple Role Check:</div>
      <div>User: {user?.email || 'None'}</div>
      <div>Auth: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Role: {loading ? 'Loading...' : role}</div>
      <div>Admin: {isAdmin ? 'Yes' : 'No'}</div>
      <div>Super: {isSuperAdmin ? 'Yes' : 'No'}</div>
    </div>
  );
};