import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  EyeOff, 
  DollarSign, 
  Shield, 
  UserCheck, 
  UserX,
  MoreHorizontal,
  Settings,
  FileText,
  Mail,
  Phone
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const members = [
  {
    id: 'LEM001234',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    level: 'Chapter',
    chapter: 'Alpha Chapter',
    region: 'Northeast',
    duesStatus: 'Paid',
    joinDate: '2020-03-15',
    status: 'Active',
    permissions: {
      dashboard: true,
      events: true,
      serviceHours: true,
      lambdaKnowledge: true,
      financialReports: false,
      adminTools: false
    },
    labels: ['Leadership Team', 'Volunteer Coordinator']
  },
  {
    id: 'LEM001235',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    level: 'Regional',
    chapter: 'Beta Chapter',
    region: 'Southeast',
    duesStatus: 'Overdue',
    joinDate: '2019-08-22',
    status: 'Active',
    permissions: {
      dashboard: true,
      events: true,
      serviceHours: true,
      lambdaKnowledge: true,
      financialReports: true,
      adminTools: false
    },
    labels: ['Regional Coordinator', 'Mentor']
  },
  {
    id: 'LEM001236',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '(555) 345-6789',
    level: 'National',
    chapter: 'Gamma Chapter',
    region: 'Midwest',
    duesStatus: 'Paid',
    joinDate: '2018-01-10',
    status: 'Active',
    permissions: {
      dashboard: true,
      events: true,
      serviceHours: true,
      lambdaKnowledge: true,
      financialReports: true,
      adminTools: true
    },
    labels: ['Executive Board', 'Financial Officer']
  }
];

export default function AdminMemberManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || member.level.toLowerCase() === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || member.status.toLowerCase() === selectedStatus;
    
    return matchesSearch && matchesLevel && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-lambda-gold to-orange-500 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Member Management</h1>
              <p className="text-white/90 mt-1">Comprehensive member administration and access control</p>
            </div>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <UserCheck className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Member Search & Filters</CardTitle>
          <CardDescription>Find and filter members by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="national">National</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="chapter">Chapter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Member List */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredMembers.length})</CardTitle>
          <CardDescription>Manage member profiles, permissions, and access controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="border rounded-lg p-4 space-y-4">
                {/* Member Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-lambda-purple text-white">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.id} • {member.level} Level</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={
                          member.duesStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                          member.duesStatus === 'Overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {member.duesStatus}
                        </Badge>
                        <Badge variant="outline">{member.status}</Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>Member Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Update Dues Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileText className="h-4 w-4 mr-2" />
                        View Reports
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <UserX className="h-4 w-4 mr-2" />
                        Suspend Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Member Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{member.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Chapter:</span> {member.chapter}</p>
                    <p><span className="font-medium">Region:</span> {member.region}</p>
                  </div>
                  <div className="space-y-2">
                    <p><span className="font-medium">Joined:</span> {new Date(member.joinDate).toLocaleDateString()}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.labels.map((label, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Access Control Panel */}
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Access Control & Permissions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Dashboard Access</span>
                      </div>
                      <Switch checked={member.permissions.dashboard} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Events</span>
                      </div>
                      <Switch checked={member.permissions.events} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Service Hours</span>
                      </div>
                      <Switch checked={member.permissions.serviceHours} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">Lambda Knowledge</span>
                      </div>
                      <Switch checked={member.permissions.lambdaKnowledge} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium">Financial Reports</span>
                      </div>
                      <Switch checked={member.permissions.financialReports} />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        <span className="text-sm font-medium">Admin Tools</span>
                      </div>
                      <Switch checked={member.permissions.adminTools} />
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Update Dues
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-3 w-3 mr-1" />
                    Send Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    View Reports
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Actions</CardTitle>
          <CardDescription>Perform actions on multiple members at once</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Bulk Dues Update
            </Button>
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Group Message
            </Button>
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Member Data
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Bulk Permission Update
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}