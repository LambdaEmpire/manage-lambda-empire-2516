import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { RealtimeProvider } from './contexts/RealtimeContext';
import ErrorBoundary from './components/ErrorBoundary';
import { useOptimizedAuth } from './hooks/useOptimizedAuth';
import { useUserRole } from './hooks/useUserRole';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import { SmartRedirect } from './components/SmartRedirect';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import SuperAdminSetup from './pages/SuperAdminSetup';
import AdminCreation from './pages/AdminCreation';
import MemberDashboard from './pages/MemberDashboard';
import AdminDashboard from './pages/AdminDashboard';
import MemberProfile from './pages/MemberProfile';
import Events from './pages/Events';
import PaymentCenter from './pages/PaymentCenter';
import MemberDirectory from './pages/MemberDirectory';
import AdminMemberManagement from './pages/AdminMemberManagement';
import LambdaKnowledge from './pages/LambdaKnowledge';
import ServiceHours from './pages/ServiceHours';
import AdminPaymentManagement from './pages/AdminPaymentManagement';
import StatusManagement from './pages/StatusManagement';
import AccomplishmentsManagement from './pages/AccomplishmentsManagement';
import MemberInbox from './pages/MemberInbox';
import AdminInboxMonitor from './pages/AdminInboxMonitor';
import Recruitment from './pages/Recruitment';
import EmpireHouse from './pages/EmpireHouse';
import RoleManagement from './pages/RoleManagement';
import Fundraising from './pages/Fundraising';
import Communications from './pages/Communications';
import AdminSquareIntegration from './pages/AdminSquareIntegration';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  const { user, session, loading } = useOptimizedAuth();
  const { role, loading: roleLoading } = useUserRole(user?.id);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600">Loading Lambda Empire...</p>
        </div>
      </div>
    );
  }

  // Public routes (no authentication required)
  const publicRoutes = (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/super-admin-setup" element={<SuperAdminSetup />} />
      {/* Redirect old admin login to unified login */}
      <Route path="/admin-login" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  // If user is not authenticated, show public routes
  if (!user || !session) {
    return publicRoutes;
  }

  // Authenticated routes with sidebar
  return (
    <DashboardLayout>
      <Routes>
        {/* Smart redirect for authenticated users */}
        <Route path="/" element={<SmartRedirect />} />
        
        {/* Member Routes */}
        <Route path="/member-dashboard" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <MemberDashboard />
          </RoleBasedRoute>
        } />
        
        <Route path="/profile" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <MemberProfile />
          </RoleBasedRoute>
        } />
        
        <Route path="/events" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <Events />
          </RoleBasedRoute>
        } />
        
        <Route path="/payments" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <PaymentCenter />
          </RoleBasedRoute>
        } />
        
        <Route path="/directory" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <MemberDirectory />
          </RoleBasedRoute>
        } />
        
        <Route path="/knowledge" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <LambdaKnowledge />
          </RoleBasedRoute>
        } />
        
        <Route path="/service-hours" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <ServiceHours />
          </RoleBasedRoute>
        } />
        
        <Route path="/accomplishments" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <AccomplishmentsManagement />
          </RoleBasedRoute>
        } />
        
        <Route path="/inbox" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <MemberInbox />
          </RoleBasedRoute>
        } />
        
        <Route path="/recruitment" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <Recruitment />
          </RoleBasedRoute>
        } />
        
        <Route path="/empire-house" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <EmpireHouse />
          </RoleBasedRoute>
        } />
        
        <Route path="/fundraising" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <Fundraising />
          </RoleBasedRoute>
        } />
        
        <Route path="/communications" element={
          <RoleBasedRoute allowedRoles={['member', 'admin', 'super_admin']}>
            <Communications />
          </RoleBasedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminDashboard />
          </RoleBasedRoute>
        } />
        
        <Route path="/admin/members" element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminMemberManagement />
          </RoleBasedRoute>
        } />
        
        <Route path="/admin/payments" element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminPaymentManagement />
          </RoleBasedRoute>
        } />
        
        <Route path="/admin/status" element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <StatusManagement />
          </RoleBasedRoute>
        } />
        
        <Route path="/admin/inbox" element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminInboxMonitor />
          </RoleBasedRoute>
        } />
        
        <Route path="/admin/square" element={
          <RoleBasedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminSquareIntegration />
          </RoleBasedRoute>
        } />

        {/* Super Admin Routes */}
        <Route path="/admin/create" element={
          <RoleBasedRoute allowedRoles={['super_admin']}>
            <AdminCreation />
          </RoleBasedRoute>
        } />
        
        <Route path="/admin/roles" element={
          <RoleBasedRoute allowedRoles={['super_admin']}>
            <RoleManagement />
          </RoleBasedRoute>
        } />

        {/* Public routes accessible to authenticated users */}
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route path="/admin-login" element={<Navigate to="/" replace />} />
        <Route path="/super-admin-setup" element={<Navigate to="/" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </DashboardLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RealtimeProvider>
          <Router>
            <AppContent />
            <Toaster />
          </Router>
        </RealtimeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;