import {
  Home,
  Users,
  Calendar,
  GraduationCap,
  Clock,
  DollarSign,
  MessageSquare,
  UserPlus,
  TreePine,
  Settings,
  Shield,
  User,
  Mail,
  Eye,
  Award,
  Star, // Import Star icon for Point System
  ClipboardList, // Import ClipboardList for Dues
  CreditCard // Import CreditCard for Payments
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { useLocation, Link } from 'react-router-dom';

const memberItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: '/inbox',
    icon: Mail,
  },
  {
    title: 'My Profile',
    url: '/profile',
    icon: User,
  },
  {
    title: 'Events',
    url: '/events',
    icon: Calendar,
  },
  {
    title: 'Lambda Knowledge',
    url: '/lambda-knowledge',
    icon: GraduationCap,
  },
  {
    title: 'Service Hours',
    url: '/service-hours',
    icon: Clock,
  },
  {
    title: 'The Empire House',
    url: '/empire-house',
    icon: TreePine,
  },
  {
    title: 'Dues',
    url: '/payments',
    icon: ClipboardList,
  },
];

const adminItems = [
  {
    title: 'Admin Dashboard',
    url: '/admin-dashboard',
    icon: Shield,
  },
  {
    title: 'Member Management',
    url: '/admin/members',
    icon: Users,
  },
  {
    title: 'Inbox Monitor',
    url: '/admin/inbox-monitor',
    icon: Eye,
  },
  {
    title: 'Accomplishments',
    url: '/admin/accomplishments',
    icon: Award,
  },
  {
    title: 'Fundraising',
    url: '/fundraising',
    icon: DollarSign,
  },
  {
    title: 'Communications',
    url: '/communications',
    icon: MessageSquare,
  },
  {
    title: 'Recruitment',
    url: '/recruitment',
    icon: UserPlus,
  },
  {
    title: 'Status Management',
    url: '/admin/status-management',
    icon: Settings,
  },
  {
    title: 'Payment Management',
    url: '/admin/payments',
    icon: DollarSign,
  },
  {
    title: 'Member Point System',
    url: '/admin/points',
    icon: Star,
  },
  {
    title: 'Quarterly Dues',
    url: '/admin/dues',
    icon: ClipboardList,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const isAdmin = true; // This would come from user context/auth

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-lambda-purple to-lambda-gold rounded-xl flex items-center justify-center text-white font-bold text-xl">
            Λ
          </div>
          <div>
            <h2 className="font-bold text-lambda-dark">Lambda Empire</h2>
            <p className="text-xs text-gray-500">Management System</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Member Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {memberItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.url}
                    className="data-[active=true]:bg-lambda-purple data-[active=true]:text-white"
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
                      className="data-[active=true]:bg-lambda-gold data-[active=true]:text-white"
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Lambda Empire
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}