import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserRole, UserRole } from '@/hooks/useUserRole';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import LoadingSpinner from './LoadingSpinner';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  fallbackPath = '/member-dashboard' 
}) => {
  const { isAuthenticated, loading: authLoading } = useOptimizedAuth();
  const { role, loading: roleLoading, hasRole } = useUserRole();

  // Debug logging
  console.assert(0, 'RoleBasedRoute Debug:', {
    isAuthenticated,
    authLoading,
    role,
    roleLoading,
    allowedRoles,
    hasRole: hasRole(allowedRoles),
    fallbackPath
  });

  if (authLoading || roleLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    console.assert(0, 'Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(allowedRoles)) {
    console.assert(0, 'Role check failed, redirecting to:', fallbackPath);
    return <Navigate to={fallbackPath} replace />;
  }

  console.assert(0, 'Role check passed, rendering children');
  return <>{children}</>;
};

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
      {children}
    </RoleBasedRoute>
  );
};

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

export const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  return (
    <RoleBasedRoute allowedRoles={['super_admin']} fallbackPath="/admin-dashboard">
      {children}
    </RoleBasedRoute>
  );
};