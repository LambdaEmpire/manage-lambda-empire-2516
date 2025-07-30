import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import LoadingSpinner from './LoadingSpinner';

export const SmartRedirect: React.FC = () => {
  const { isAuthenticated, loading: authLoading } = useOptimizedAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (role) {
    case 'super_admin':
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'member':
    default:
      return <Navigate to="/member-dashboard" replace />;
  }
};