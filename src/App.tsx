import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MemberDashboard from '@/pages/MemberDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import EmpireHouse from '@/pages/EmpireHouse';
import Events from '@/pages/Events';
import LambdaKnowledge from '@/pages/LambdaKnowledge';
import ServiceHours from '@/pages/ServiceHours';
import Fundraising from '@/pages/Fundraising';
import Communications from '@/pages/Communications';
import Recruitment from '@/pages/Recruitment';
import MemberProfile from '@/pages/MemberProfile';
import './App.css';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-slate-100">
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<MemberDashboard />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="empire-house" element={<EmpireHouse />} />
              <Route path="events" element={<Events />} />
              <Route path="lambda-knowledge" element={<LambdaKnowledge />} />
              <Route path="service-hours" element={<ServiceHours />} />
              <Route path="fundraising" element={<Fundraising />} />
              <Route path="communications" element={<Communications />} />
              <Route path="recruitment" element={<Recruitment />} />
              <Route path="profile" element={<MemberProfile />} />
            </Route>
          </Routes>
        </div>
        <Toaster />
      </SidebarProvider>
    </Router>
  );
}

export default App;