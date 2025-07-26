import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  UserPlus
} from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-lambda-gold to-orange-500 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-white/90 mt-1">Lambda Empire Management System</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Q4 Collections</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$187,050</div>
            <p className="text-xs text-muted-foreground">94% collection rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admin Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Administrative Actions</CardTitle>
            <CardDescription>Latest system activities and member updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Payment Status Updated</p>
                <p className="text-sm text-gray-600">John Doe (LEM001234) marked as paid for Q4 2024</p>
              </div>
              <Badge variant="secondary">2 min ago</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">New Member Approved</p>
                <p className="text-sm text-gray-600">Sarah Johnson added to Regional Chapter</p>
              </div>
              <Badge variant="secondary">15 min ago</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium">Event Created</p>
                <p className="text-sm text-gray-600">Annual Gala 2025 published with ticketing</p>
              </div>
              <Badge variant="secondary">1 hour ago</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-lambda-purple hover:bg-lambda-purple/90">
              <Users className="h-4 w-4 mr-2" />
              Manage Members
            </Button>
            <Button className="w-full justify-start bg-lambda-gold hover:bg-lambda-gold/90">
              <DollarSign className="h-4 w-4 mr-2" />
              Update Dues Status
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Create Event
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Member
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Overdue Payments</p>
                <p className="text-sm text-gray-600">47 members have overdue Q4 2024 payments</p>
                <Button size="sm" className="mt-2">Review</Button>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium">Pending Approvals</p>
                <p className="text-sm text-gray-600">8 new member applications awaiting review</p>
                <Button size="sm" variant="outline" className="mt-2">Review</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Overview</CardTitle>
            <CardDescription>Current membership distribution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">National Level</p>
                <p className="text-sm text-gray-600">Executive Leadership</p>
              </div>
              <Badge>12 Members</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Regional Level</p>
                <p className="text-sm text-gray-600">Regional Coordinators</p>
              </div>
              <Badge>156 Members</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Chapter Level</p>
                <p className="text-sm text-gray-600">Local Chapter Members</p>
              </div>
              <Badge>1,079 Members</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}