import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { LazyLoader } from './components/LazyLoader';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { useOptimizedAuth } from './hooks/useOptimizedAuth';
import { RoleBasedRoute, AdminRoute, SuperAdminRoute } from './components/RoleBasedRoute';
import { SmartRedirect } from './components/SmartRedirect';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load all pages for better performance
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const SuperAdminSetup = lazy(() => import('./pages/SuperAdminSetup'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const Events = lazy(() => import('./pages/Events'));
const PaymentCenter = lazy(() => import('./pages/PaymentCenter'));
const MemberDirectory = lazy(() => import('./pages/MemberDirectory'));
const AdminMemberManagement = lazy(() => import('./pages/AdminMemberManagement'));
const LambdaKnowledge = lazy(() => import('./pages/LambdaKnowledge'));
const ServiceHours = lazy(() => import('./pages/ServiceHours'));
const AdminPaymentManagement = lazy(() => import('./pages/AdminPaymentManagement'));
const StatusManagement = lazy(() => import('./pages/StatusManagement'));
const AdminCreation = lazy(() => import('./pages/AdminCreation'));
const AccomplishmentsManagement = lazy(() => import('./pages/AccomplishmentsManagement'));
const MemberInbox = lazy(() => import('./pages/MemberInbox'));
const AdminInboxMonitor = lazy(() => import('./pages/AdminInboxMonitor'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const EmpireHouse = lazy(() => import('./pages/EmpireHouse'));
const Fundraising = lazy(() => import('./pages/Fundraising'));
const Communications = lazy(() => import('./pages/Communications'));
const AdminSquareIntegration = lazy(() => import('./pages/AdminSquareIntegration'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useOptimizedAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects authenticated users)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useOptimizedAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <SmartRedirect />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/" 
                element={
                  <LazyLoader>
                    <Index />
                  </LazyLoader>
                } 
              />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LazyLoader>
                      <Login />
                    </LazyLoader>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/admin-login" 
                element={
                  <PublicRoute>
                    <LazyLoader>
                      <AdminLogin />
                    </LazyLoader>
                  </PublicRoute>
                } 
              />
              <Route 
                path="/super-admin-setup" 
                element={
                  <LazyLoader>
                    <SuperAdminSetup />
                  </LazyLoader>
                } 
              />

              {/* Smart redirect for authenticated users */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <SmartRedirect />
                  </ProtectedRoute>
                } 
              />

              {/* Member Routes */}
              <Route 
                path="/member-dashboard" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <MemberDashboard />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/member-profile" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <MemberProfile />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/events" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <Events />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/payment-center" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <PaymentCenter />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/member-directory" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <MemberDirectory />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/lambda-knowledge" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <LambdaKnowledge />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/service-hours" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <ServiceHours />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/accomplishments" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <AccomplishmentsManagement />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/member-inbox" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <MemberInbox />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/recruitment" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <Recruitment />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/empire-house" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <EmpireHouse />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />
              <Route 
                path="/fundraising" 
                element={
                  <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
                    <LazyLoader>
                      <Fundraising />
                    </LazyLoader>
                  </RoleBasedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <AdminRoute>
                    <LazyLoader>
                      <AdminDashboard />
                    </LazyLoader>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin-member-management" 
                element={
                  <AdminRoute>
                    <LazyLoader>
                      <AdminMemberManagement />
                    </LazyLoader>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin-payment-management" 
                element={
                  <AdminRoute>
                    <LazyLoader>
                      <AdminPaymentManagement />
                    </LazyLoader>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/status-management" 
                element={
                  <AdminRoute>
                    <LazyLoader>
                      <StatusManagement />
                    </LazyLoader>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin-inbox-monitor" 
                element={
                  <AdminRoute>
                    <LazyLoader>
                      <AdminInboxMonitor />
                    </LazyLoader>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/communications" 
                element={
                  <AdminRoute>
                    <LazyLoader>
                      <Communications />
                    </LazyLoader>
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin-square-integration" 
                element={
                  <AdminRoute>
                    <LazyLoader>
                      <AdminSquareIntegration />
                    </LazyLoader>
                  </AdminRoute>
                } 
              />

              {/* Super Admin Routes */}
              <Route 
                path="/admin-creation" 
                element={
                  <SuperAdminRoute>
                    <LazyLoader>
                      <AdminCreation />
                    </LazyLoader>
                  </SuperAdminRoute>
                } 
              />

              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <LazyLoader>
                    <NotFound />
                  </LazyLoader>
                } 
              />
            </Routes>
            
            <Toaster position="top-right" />
            <PerformanceMonitor />
          </div>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;