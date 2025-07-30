import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import LoadingSpinner from './LoadingSpinner';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles
}) => {
  const { isAuthenticated, loading: authLoading } = useOptimizedAuth();
  const { role, loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/member-dashboard" replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
      {children}
    </RoleBasedRoute>
  );
};

export const SuperAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['super_admin']}>
      {children}
    </RoleBasedRoute>
  );
};