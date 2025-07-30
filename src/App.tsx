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
const DashboardLayout = lazy(() => import('./components/layout/DashboardLayout'));

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

              {/* Protected Routes with Dashboard Layout */}
              <Route 
                path="/member-dashboard" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><MemberDashboard /></LazyLoader>} />
              </Route>

              <Route 
                path="/member-profile" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><MemberProfile /></LazyLoader>} />
              </Route>

              <Route 
                path="/events" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><Events /></LazyLoader>} />
              </Route>

              <Route 
                path="/payment-center" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><PaymentCenter /></LazyLoader>} />
              </Route>

              <Route 
                path="/member-directory" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><MemberDirectory /></LazyLoader>} />
              </Route>

              <Route 
                path="/lambda-knowledge" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><LambdaKnowledge /></LazyLoader>} />
              </Route>

              <Route 
                path="/service-hours" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><ServiceHours /></LazyLoader>} />
              </Route>

              <Route 
                path="/accomplishments" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><AccomplishmentsManagement /></LazyLoader>} />
              </Route>

              <Route 
                path="/member-inbox" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><MemberInbox /></LazyLoader>} />
              </Route>

              <Route 
                path="/recruitment" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><Recruitment /></LazyLoader>} />
              </Route>

              <Route 
                path="/empire-house" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><EmpireHouse /></LazyLoader>} />
              </Route>

              <Route 
                path="/fundraising" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><Fundraising /></LazyLoader>} />
              </Route>

              {/* Admin Routes */}
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><AdminDashboard /></LazyLoader>} />
              </Route>

              <Route 
                path="/admin-member-management" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><AdminMemberManagement /></LazyLoader>} />
              </Route>

              <Route 
                path="/admin-payment-management" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><AdminPaymentManagement /></LazyLoader>} />
              </Route>

              <Route 
                path="/status-management" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><StatusManagement /></LazyLoader>} />
              </Route>

              <Route 
                path="/admin-creation" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><AdminCreation /></LazyLoader>} />
              </Route>

              <Route 
                path="/admin-inbox-monitor" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><AdminInboxMonitor /></LazyLoader>} />
              </Route>

              <Route 
                path="/communications" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><Communications /></LazyLoader>} />
              </Route>

              <Route 
                path="/admin-square-integration" 
                element={
                  <ProtectedRoute>
                    <LazyLoader>
                      <DashboardLayout />
                    </LazyLoader>
                  </ProtectedRoute>
                }
              >
                <Route index element={<LazyLoader><AdminSquareIntegration /></LazyLoader>} />
              </Route>

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