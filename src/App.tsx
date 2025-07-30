import React, { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { LazyLoader } from './components/LazyLoader';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { useOptimizedAuth } from './hooks/useOptimizedAuth';
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
    return <Navigate to="/member-dashboard" replace />;
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

              {/* Protected Member Routes */}
              <Route 
                path="/member-dashboard" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <MemberDashboard />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/member-profile" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <MemberProfile />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <Events />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/payment-center" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <PaymentCenter />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/member-directory" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <MemberDirectory />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lambda-knowledge" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <LambdaKnowledge />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/service-hours" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <ServiceHours />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/accomplishments" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <AccomplishmentsManagement />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/member-inbox" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <MemberInbox />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/recruitment" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <Recruitment />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/empire-house" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <EmpireHouse />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/fundraising" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <Fundraising />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <AdminDashboard />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-member-management" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <AdminMemberManagement />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-payment-management" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <AdminPaymentManagement />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/status-management" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <StatusManagement />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-creation" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <AdminCreation />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-inbox-monitor" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <AdminInboxMonitor />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/communications" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <Communications />
                    </LazyLoader>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin-square-integration" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <AdminSquareIntegration />
                    </LazyLoader>
                  </ProtectedRoute>
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