import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Login from '@/pages/Login';
import SuperAdminSetup from '@/pages/SuperAdminSetup';
import AdminCreation from '@/pages/AdminCreation';
import MemberDashboard from '@/pages/MemberDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminMemberManagement from '@/pages/AdminMemberManagement';
import AdminInboxMonitor from '@/pages/AdminInboxMonitor';
import MemberInbox from '@/pages/MemberInbox';
import EmpireHouse from '@/pages/EmpireHouse';
import Events from '@/pages/Events';
import LambdaKnowledge from '@/pages/LambdaKnowledge';
import ServiceHours from '@/pages/ServiceHours';
import Fundraising from '@/pages/Fundraising';
import Communications from '@/pages/Communications';
import Recruitment from '@/pages/Recruitment';
import MemberProfile from '@/pages/MemberProfile';
import AccomplishmentsManagement from '@/pages/AccomplishmentsManagement';
import './App.css';

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
          <Route index element={<MemberDashboard />} />
          <Route path="member-dashboard" element={<MemberDashboard />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          <Route path="admin/members" element={<AdminMemberManagement />} />
          <Route path="admin/create-admin" element={<AdminCreation />} />
          <Route path="admin/inbox-monitor" element={<AdminInboxMonitor />} />
          <Route path="admin/accomplishments" element={<AccomplishmentsManagement />} />
          <Route path="inbox" element={<MemberInbox />} />
          <Route path="empire-house" element={<EmpireHouse />} />
          <Route path="events" element={<Events />} />
          <Route path="lambda-knowledge" element={<LambdaKnowledge />} />
          <Route path="service-hours" element={<ServiceHours />} />
          <Route path="fundraising" element={<Fundraising />} />
          <Route path="communications" element={<Communications />} />
          <Route path="recruitment" element={<Recruitment />} />
          <Route path="profile/:memberId" element={<MemberProfile />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;