import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Login from '@/pages/Login';
import SuperAdminSetup from '@/pages/SuperAdminSetup';
import './App.css';

// Lazy load components to improve initial load time
const MemberDashboard = lazy(() => import('@/pages/MemberDashboard'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminCreation = lazy(() => import('@/pages/AdminCreation'));
const AdminMemberManagement = lazy(() => import('@/pages/AdminMemberManagement'));
const AdminInboxMonitor = lazy(() => import('@/pages/AdminInboxMonitor'));
const MemberInbox = lazy(() => import('@/pages/MemberInbox'));
const EmpireHouse = lazy(() => import('@/pages/EmpireHouse'));
const Events = lazy(() => import('@/pages/Events'));
const LambdaKnowledge = lazy(() => import('@/pages/LambdaKnowledge'));
const ServiceHours = lazy(() => import('@/pages/ServiceHours'));
const Fundraising = lazy(() => import('@/pages/Fundraising'));
const Communications = lazy(() => import('@/pages/Communications'));
const Recruitment = lazy(() => import('@/pages/Recruitment'));
const MemberProfile = lazy(() => import('@/pages/MemberProfile'));
const MemberDirectory = lazy(() => import('@/pages/MemberDirectory'));
const AccomplishmentsManagement = lazy(() => import('@/pages/AccomplishmentsManagement'));
const StatusManagement = lazy(() => import('@/pages/StatusManagement'));
const PaymentCenter = lazy(() => import('@/pages/PaymentCenter'));
const AdminPaymentManagementPage = lazy(() => import('@/pages/AdminPaymentManagement'));
const MemberPointSystem = lazy(() => import('@/components/MemberPointSystem'));
const QuarterlyDuesManagement = lazy(() => import('@/components/QuarterlyDuesManagement'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      <p className="text-gray-600">Loading Lambda Empire...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication routes - outside of dashboard layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<SuperAdminSetup />} />
        
        {/* Dashboard routes - inside dashboard layout */}
        <Route path="/" element={
          <SidebarProvider>
            <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
              <DashboardLayout />
            </div>
          </SidebarProvider>
        }>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <MemberDashboard />
            </Suspense>
          } />
          <Route path="member-dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MemberDashboard />
            </Suspense>
          } />
          <Route path="admin-dashboard" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminDashboard />
            </Suspense>
          } />
          <Route path="admin/members" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminMemberManagement />
            </Suspense>
          } />
          <Route path="admin/create-admin" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminCreation />
            </Suspense>
          } />
          <Route path="admin/inbox-monitor" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminInboxMonitor />
            </Suspense>
          } />
          <Route path="admin/accomplishments" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AccomplishmentsManagement />
            </Suspense>
          } />
          <Route path="admin/status-management" element={
            <Suspense fallback={<LoadingSpinner />}>
              <StatusManagement />
            </Suspense>
          } />
          <Route path="admin/payments" element={
            <Suspense fallback={<LoadingSpinner />}>
              <AdminPaymentManagementPage />
            </Suspense>
          } />
          <Route path="admin/points" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MemberPointSystem />
            </Suspense>
          } />
          <Route path="admin/dues" element={
            <Suspense fallback={<LoadingSpinner />}>
              <QuarterlyDuesManagement />
            </Suspense>
          } />
          <Route path="payments" element={
            <Suspense fallback={<LoadingSpinner />}>
              <PaymentCenter />
            </Suspense>
          } />
          <Route path="inbox" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MemberInbox />
            </Suspense>
          } />
          <Route path="empire-house" element={
            <Suspense fallback={<LoadingSpinner />}>
              <EmpireHouse />
            </Suspense>
          } />
          <Route path="events" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Events />
            </Suspense>
          } />
          <Route path="lambda-knowledge" element={
            <Suspense fallback={<LoadingSpinner />}>
              <LambdaKnowledge />
            </Suspense>
          } />
          <Route path="service-hours" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ServiceHours />
            </Suspense>
          } />
          <Route path="fundraising" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Fundraising />
            </Suspense>
          } />
          <Route path="communications" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Communications />
            </Suspense>
          } />
          <Route path="recruitment" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Recruitment />
            </Suspense>
          } />
          <Route path="member-directory" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MemberDirectory />
            </Suspense>
          } />
          <Route path="profile/:memberId" element={
            <Suspense fallback={<LoadingSpinner />}>
              <MemberProfile />
            </Suspense>
          } />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;