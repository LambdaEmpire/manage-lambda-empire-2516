import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { RealtimeProvider } from './contexts/RealtimeContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components for better performance
const Index = lazy(() => import('./pages/Index'));
const Login = lazy(() => import('./pages/Login'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const SuperAdminSetup = lazy(() => import('./pages/SuperAdminSetup'));
const AdminCreation = lazy(() => import('./pages/AdminCreation'));
const MemberDashboard = lazy(() => import('./pages/MemberDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const MemberDirectory = lazy(() => import('./pages/MemberDirectory'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const Events = lazy(() => import('./pages/Events'));
const PaymentCenter = lazy(() => import('./pages/PaymentCenter'));
const ServiceHours = lazy(() => import('./pages/ServiceHours'));
const LambdaKnowledge = lazy(() => import('./pages/LambdaKnowledge'));
const MemberInbox = lazy(() => import('./pages/MemberInbox'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const EmpireHouse = lazy(() => import('./pages/EmpireHouse'));
const AdminMemberManagement = lazy(() => import('./pages/AdminMemberManagement'));
const AdminPaymentManagement = lazy(() => import('./pages/AdminPaymentManagement'));
const AdminInboxMonitor = lazy(() => import('./pages/AdminInboxMonitor'));
const StatusManagement = lazy(() => import('./pages/StatusManagement'));
const AccomplishmentsManagement = lazy(() => import('./pages/AccomplishmentsManagement'));
const Fundraising = lazy(() => import('./pages/Fundraising'));
const Communications = lazy(() => import('./pages/Communications'));
const AdminSquareIntegration = lazy(() => import('./pages/AdminSquareIntegration'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RealtimeProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin-login" element={<AdminLogin />} />
                  <Route path="/super-admin-setup" element={<SuperAdminSetup />} />
                  <Route path="/admin-creation" element={<AdminCreation />} />
                  <Route path="/member-dashboard" element={<MemberDashboard />} />
                  <Route path="/admin-dashboard" element={<AdminDashboard />} />
                  <Route path="/member-directory" element={<MemberDirectory />} />
                  <Route path="/member-profile/:memberId" element={<MemberProfile />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/payment-center" element={<PaymentCenter />} />
                  <Route path="/service-hours" element={<ServiceHours />} />
                  <Route path="/lambda-knowledge" element={<LambdaKnowledge />} />
                  <Route path="/member-inbox" element={<MemberInbox />} />
                  <Route path="/recruitment" element={<Recruitment />} />
                  <Route path="/empire-house" element={<EmpireHouse />} />
                  <Route path="/admin-member-management" element={<AdminMemberManagement />} />
                  <Route path="/admin-payment-management" element={<AdminPaymentManagement />} />
                  <Route path="/admin-inbox-monitor" element={<AdminInboxMonitor />} />
                  <Route path="/status-management" element={<StatusManagement />} />
                  <Route path="/accomplishments-management" element={<AccomplishmentsManagement />} />
                  <Route path="/fundraising" element={<Fundraising />} />
                  <Route path="/communications" element={<Communications />} />
                  <Route path="/admin-square-integration" element={<AdminSquareIntegration />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </RealtimeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;