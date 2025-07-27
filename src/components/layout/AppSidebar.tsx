import { Link, useLocation } from 'react-router-dom';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  BookOpen,
  Clock,
  Heart,
  Megaphone,
  UserPlus,
  Building,
  Settings,
  Shield,
  Crown,
  Award,
  BarChart3,
  Mail,
  TrendingUp
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
  };
}

interface Profile {
  id: string;
  first_name?: string;
  last_name?: string;
  can_approve_members?: boolean;
  is_super_admin?: boolean;
}

interface AppSidebarProps {
  user: User;
  profile: Profile | null;
}

export function AppSidebar({ user, profile }: AppSidebarProps) {
  const location = useLocation();
  const isAdmin = profile?.can_approve_members || profile?.is_super_admin;

  const memberItems = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Member Directory",
      url: "/member-directory",
      icon: Users,
    },
    {
      title: "Events",
      url: "/events",
      icon: Calendar,
    },
    {
      title: "Payment Center",
      url: "/payments",
      icon: DollarSign,
    },
    {
      title: "Service Hours",
      url: "/service-hours",
      icon: Clock,
    },
    {
      title: "Lambda Knowledge",
      url: "/lambda-knowledge",
      icon: BookOpen,
    },
    {
      title: "Communications",
      url: "/communications",
      icon: Megaphone,
    },
    {
      title: "Fundraising",
      url: "/fundraising",
      icon: Heart,
    },
    {
      title: "Recruitment",
      url: "/recruitment",
      icon: UserPlus,
    },
    {
      title: "Empire House",
      url: "/empire-house",
      icon: Building,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: MessageSquare,
    },
  ];

  const adminItems = [
    {
      title: "Admin Dashboard",
      url: "/admin-dashboard",
      icon: Shield,
    },
    {
      title: "Member Management",
      url: "/admin/members",
      icon: Users,
    },
    {
      title: "Payment Management",
      url: "/admin/payments",
      icon: DollarSign,
    },
    {
      title: "Dues Management",
      url: "/admin/dues",
      icon: TrendingUp,
    },
    {
      title: "Accomplishments",
      url: "/admin/accomplishments",
      icon: Award,
    },
    {
      title: "Status Management",
      url: "/admin/status-management",
      icon: BarChart3,
    },
    {
      title: "Inbox Monitor",
      url: "/admin/inbox-monitor",
      icon: Mail,
    },
    {
      title: "Point System",
      url: "/admin/points",
      icon: Award,
    },
  ];

  const superAdminItems = [
    {
      title: "Create Admin",
      url: "/admin/create-admin",
      icon: Crown,
    },
  ];

  const getUserDisplayName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (user.user_metadata?.first_name && user.user_metadata?.last_name) {
      return `${user.user_metadata.first_name} ${user.user_metadata.last_name}`;
    }
    return user.email;
  };

  const getUserInitials = () => {
    const firstName = profile?.first_name || user.user_metadata?.first_name || '';
    const lastName = profile?.last_name || user.user_metadata?.last_name || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    }
    return user.email[0].toUpperCase();
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getUserDisplayName()}
            </p>
            <div className="flex items-center space-x-1">
              {profile?.is_super_admin && (
                <Badge variant="default" className="text-xs bg-purple-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Super Admin
                </Badge>
              )}
              {profile?.can_approve_members && !profile?.is_super_admin && (
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
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

        {profile?.is_super_admin && (
          <SidebarGroup>
            <SidebarGroupLabel>Super Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {superAdminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={location.pathname === item.url}
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

      <SidebarFooter className="p-4">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Lambda Empire
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}