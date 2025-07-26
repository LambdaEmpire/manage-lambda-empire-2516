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
  Phone,
  UserPlus,
  MessageSquare,
  TrendingUp,
  Crown,
  CheckCircle,
  AlertTriangle
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const memberTitles = [
  { value: 'national_president', label: 'National President', level: 'national', priority: 1 },
  { value: 'national_vp', label: 'National Vice President', level: 'national', priority: 2 },
  { value: 'national_secretary', label: 'National Secretary', level: 'national', priority: 3 },
  { value: 'national_treasurer', label: 'National Treasurer', level: 'national', priority: 4 },
  { value: 'regional_director', label: 'Regional Director', level: 'regional', priority: 5 },
  { value: 'regional_coordinator', label: 'Regional Coordinator', level: 'regional', priority: 6 },
  { value: 'chapter_president', label: 'Chapter President', level: 'chapter', priority: 7 },
  { value: 'chapter_vp', label: 'Chapter Vice President', level: 'chapter', priority: 8 },
  { value: 'chapter_secretary', label: 'Chapter Secretary', level: 'chapter', priority: 9 },
  { value: 'chapter_treasurer', label: 'Chapter Treasurer', level: 'chapter', priority: 10 },
  { value: 'member', label: 'General Member', level: 'chapter', priority: 11 }
];

const permissionCategories = [
  {
    name: 'Core Access',
    permissions: [
      { key: 'dashboard', label: 'Dashboard Access', icon: Eye, description: 'Access to main dashboard' },
      { key: 'profile', label: 'Profile Management', icon: UserCheck, description: 'Edit personal profile' },
      { key: 'events', label: 'Events', icon: Eye, description: 'View and register for events' },
      { key: 'serviceHours', label: 'Service Hours', icon: Eye, description: 'Log and view service hours' },
      { key: 'lambdaKnowledge', label: 'Lambda Knowledge', icon: Eye, description: 'Access learning modules' }
    ]
  },
  {
    name: 'Administrative',
    permissions: [
      { key: 'recruitment', label: 'Recruitment Center', icon: UserPlus, description: 'Manage applications and pledges' },
      { key: 'communications', label: 'Communications', icon: MessageSquare, description: 'Send messages and announcements' },
      { key: 'memberManagement', label: 'Member Management', icon: Users, description: 'Manage other members' },
      { key: 'adminTools', label: 'Admin Tools', icon: Shield, description: 'Advanced administrative functions' },
      { key: 'canApproveMembers', label: 'Can Approve Members', icon: CheckCircle, description: 'Can approve new member applications' } // New permission
    ]
  },
  {
    name: 'Financial',
    permissions: [
      { key: 'financialReports', label: 'Financial Reports', icon: TrendingUp, description: 'View financial data and reports' },
      { key: 'nationalDues', label: 'National Dues Management', icon: DollarSign, description: 'Manage national-level dues' },
      { key: 'fundraising', label: 'Fundraising Management', icon: DollarSign, description: 'Manage fundraising campaigns' },
      { key: 'treasuryAccess', label: 'Treasury Access', icon: Crown, description: 'Full financial system access' }
    ]
  }
];

const members = [
  {
    id: 'LEM001234',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    level: 'Chapter',
    title: 'chapter_president',
    chapter: 'Alpha Chapter',
    region: 'Northeast',
    duesStatus: 'Paid',
    joinDate: '2020-03-15',
    status: 'Active',
    approvalStatus: 'approved',
    genderAffiliation: 'Fraternity',
    city: 'New York', // New field
    state: 'NY', // New field
    permissions: {
      dashboard: true, profile: true, events: true, serviceHours: true, lambdaKnowledge: true,
      recruitment: true, communications: true, memberManagement: false, adminTools: false, canApproveMembers: false, // New permission
      financialReports: false, nationalDues: false, fundraising: true, treasuryAccess: false
    },
    labels: ['Leadership Team', 'Volunteer Coordinator']
  },
  {
    id: 'LEM001235',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    level: 'Regional',
    title: 'regional_director',
    chapter: 'Beta Chapter',
    region: 'Southeast',
    duesStatus: 'Overdue',
    joinDate: '2019-08-22',
    status: 'Active',
    approvalStatus: 'pending',
    genderAffiliation: 'Sorority',
    city: 'Atlanta', // New field
    state: 'GA', // New field
    permissions: {
      dashboard: true, profile: true, events: true, serviceHours: true, lambdaKnowledge: true,
      recruitment: true, communications: true, memberManagement: true, adminTools: false, canApproveMembers: true, // New permission
      financialReports: true, nationalDues: false, fundraising: true, treasuryAccess: false
    },
    labels: ['Regional Coordinator', 'Mentor']
  },
  {
    id: 'LEM001236',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '(555) 345-6789',
    level: 'National',
    title: 'national_treasurer',
    chapter: 'Gamma Chapter',
    region: 'Midwest',
    duesStatus: 'Paid',
    joinDate: '2018-01-10',
    status: 'Active',
    approvalStatus: 'approved',
    genderAffiliation: 'Fraternity',
    city: 'Chicago', // New field
    state: 'IL', // New field
    permissions: {
      dashboard: true, profile: true, events: true, serviceHours: true, lambdaKnowledge: true,
      recruitment: true, communications: true, memberManagement: true, adminTools: true, canApproveMembers: true, // New permission
      financialReports: true, nationalDues: true, fundraising: true, treasuryAccess: true
    },
    labels: ['Executive Board', 'Financial Officer']
  },
  {
    id: 'LEM001237',
    name: 'Emily White',
    email: 'emily.w@email.com',
    phone: '(555) 456-7890',
    level: 'National',
    title: 'national_vp',
    chapter: 'Delta Chapter',
    region: 'West',
    duesStatus: 'Paid',
    joinDate: '2021-05-01',
    status: 'Active',
    approvalStatus: 'approved',
    genderAffiliation: 'Sorority',
    city: 'Los Angeles', // New field
    state: 'CA', // New field
    permissions: {
      dashboard: true, profile: true, events: true, serviceHours: true, lambdaKnowledge: true,
      recruitment: true, communications: true, memberManagement: true, adminTools: true, canApproveMembers: true, // New permission
      financialReports: true, nationalDues: true, fundraising: true, treasuryAccess: true
    },
    labels: ['National Leadership', 'Sorority Liaison']
  }
];

export default function AdminMemberManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('all');
  const [selectedGenderAffiliation, setSelectedGenderAffiliation] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [restrictMemberView, setRestrictMemberView] = useState(false);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || member.level.toLowerCase() === selectedLevel;
    const matchesStatus = selectedStatus === 'all' || member.status.toLowerCase() === selectedStatus;
    const matchesApproval = selectedApprovalStatus === 'all' || member.approvalStatus === selectedApprovalStatus;
    const matchesGenderAffiliation = selectedGenderAffiliation === 'all' || member.genderAffiliation === selectedGenderAffiliation;
    
    // Logic for restricted member view based on admin's level and gender affiliation
    if (restrictMemberView) {
      // This is a simplified example. In a real app, the logged-in admin's data would come from auth context.
      // For demonstration, let's assume the logged-in admin is Michael Brown (LEM001236 - National, Fraternity)
      // or Emily White (LEM001237 - National, Sorority)
      const loggedInAdmin = members[2]; // Michael Brown (Fraternity)
      // const loggedInAdmin = members[3]; // Emily White (Sorority)

      if (loggedInAdmin.level === 'Chapter' && member.chapter !== loggedInAdmin.chapter) {
        return false;
      }
      if (loggedInAdmin.level === 'Regional' && member.region !== loggedInAdmin.region) {
        return false;
      }
      // Specific logic for National Level members to see only their affiliation
      if (loggedInAdmin.level === 'National' && loggedInAdmin.genderAffiliation && member.genderAffiliation !== loggedInAdmin.genderAffiliation) {
        return false;
      }
    }

    return matchesSearch && matchesLevel && matchesStatus && matchesApproval && matchesGenderAffiliation;
  });

  const getTitleInfo = (titleValue) => {
    return memberTitles.find(title => title.value === titleValue) || memberTitles[memberTitles.length - 1];
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateMemberPermissions = (memberId, permissionKey, value) => {
    // This would typically update the backend
    console.log(`Updating ${memberId} permission ${permissionKey} to ${value}`);
  };

  const updateMemberApproval = (memberId, status, reason = '') => {
    // This would typically update the backend
    console.log(`Updating ${memberId} approval status to ${status}`, reason);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-lambda-gold to-orange-500 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Member Management</h1>
              <p className="text-white/90 mt-1">Comprehensive member administration and granular access control</p>
            </div>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <UserCheck className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Member Search & Filters</CardTitle>
          <CardDescription>Find and filter members by various criteria including approval status and gender affiliation</CardDescription>
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
            <Select value={selectedApprovalStatus} onValueChange={setSelectedApprovalStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Approval Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Approvals</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedGenderAffiliation} onValueChange={setSelectedGenderAffiliation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Gender Affiliation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Affiliations</SelectItem>
                <SelectItem value="Fraternity">Fraternity</SelectItem>
                <SelectItem value="Sorority">Sorority</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="restrict-member-view"
              checked={restrictMemberView}
              onCheckedChange={setRestrictMemberView}
            />
            <Label htmlFor="restrict-member-view">Restrict Member View (based on admin's level and affiliation)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Member List */}
      <Card>
        <CardHeader>
          <CardTitle>Members ({filteredMembers.length})</CardTitle>
          <CardDescription>Manage member profiles, permissions, and access controls with title-based approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => {
              const titleInfo = getTitleInfo(member.title);
              
              return (
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
                        <p className="text-sm text-gray-600">{member.id} • {titleInfo.label}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={
                            member.duesStatus === 'Paid' ? 'bg-green-100 text-green-800' :
                            member.duesStatus === 'Overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {member.duesStatus}
                          </Badge>
                          <Badge variant="outline">{member.status}</Badge>
                          <Badge className={getApprovalStatusColor(member.approvalStatus)}>
                            {member.approvalStatus === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {member.approvalStatus === 'pending' && <AlertTriangle className="h-3 w-3 mr-1" />}
                            {member.approvalStatus.charAt(0).toUpperCase() + member.approvalStatus.slice(1)}
                          </Badge>
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
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedMember(member);
                            setIsPermissionDialogOpen(true);
                          }}
                        >
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
                        {member.approvalStatus === 'pending' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => updateMemberApproval(member.id, 'approved')}
                              className="text-green-600"
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve Access
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => updateMemberApproval(member.id, 'rejected')}
                              className="text-red-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Reject Access
                            </DropdownMenuItem>
                          </>
                        )}
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
                      <p><span className="font-medium">Affiliation:</span> {member.genderAffiliation}</p>
                      <p><span className="font-medium">Location:</span> {member.city}, {member.state}</p> {/* Display city and state */}
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

                  {/* Enhanced Access Control Panel */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Access Control & Permissions
                      {member.approvalStatus === 'pending' && (
                        <Badge className="bg-yellow-100 text-yellow-800 ml-2">
                          Awaiting Approval
                        </Badge>
                      )}
                    </h4>
                    
                    {/* Permission Categories */}
                    {permissionCategories.map((category) => (
                      <div key={category.name} className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">{category.name}</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.permissions.map((permission) => {
                            const IconComponent = permission.icon;
                            const isEnabled = member.permissions[permission.key];
                            const isRestricted = member.approvalStatus !== 'approved' && 
                                               ['financialReports', 'nationalDues', 'treasuryAccess', 'adminTools'].includes(permission.key);
                            
                            return (
                              <div 
                                key={permission.key}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  category.name === 'Financial' ? 'bg-yellow-50 border-yellow-200' :
                                  category.name === 'Administrative' ? 'bg-blue-50 border-blue-200' :
                                  'bg-gray-50 border-gray-200'
                                } ${isRestricted ? 'opacity-50' : ''}`}
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className={`h-4 w-4 ${
                                    category.name === 'Financial' ? 'text-yellow-600' :
                                    category.name === 'Administrative' ? 'text-blue-600' :
                                    'text-gray-500'
                                  }`} />
                                  <div>
                                    <span className="text-sm font-medium">{permission.label}</span>
                                    {isRestricted && (
                                      <p className="text-xs text-red-600">Requires approval</p>
                                    )}
                                  </div>
                                </div>
                                <Switch 
                                  checked={isEnabled && !isRestricted}
                                  disabled={isRestricted}
                                  onCheckedChange={(checked) => 
                                    updateMemberPermissions(member.id, permission.key, checked)
                                  }
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
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
                    {member.approvalStatus === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateMemberApproval(member.id, 'approved')}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve Access
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Permission Management Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Advanced Permission Management</DialogTitle>
            <DialogDescription>
              Configure detailed access permissions for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* Member Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-lambda-purple text-white">
                    {selectedMember.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedMember.name}</h3>
                  <p className="text-sm text-gray-600">{getTitleInfo(selectedMember.title).label}</p>
                  <Badge className={getApprovalStatusColor(selectedMember.approvalStatus)}>
                    {selectedMember.approvalStatus}
                  </Badge>
                </div>
              </div>

              {/* Title-Based Approval */}
              <div className="space-y-4">
                <h4 className="font-medium">Title-Based Access Approval</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Title</Label>
                    <Select value={selectedMember.title}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {memberTitles.map((title) => (
                          <SelectItem key={title.value} value={title.value}>
                            {title.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Approval Status</Label>
                    <Select value={selectedMember.approvalStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {selectedMember.approvalStatus === 'rejected' && (
                  <div>
                    <Label>Rejection Reason</Label>
                    <Textarea placeholder="Explain why access was rejected..." />
                  </div>
                )}
              </div>

              {/* Detailed Permissions */}
              <div className="space-y-4">
                <h4 className="font-medium">Detailed Permission Settings</h4>
                {permissionCategories.map((category) => (
                  <div key={category.name} className="border rounded-lg p-4">
                    <h5 className="font-medium mb-3">{category.name}</h5>
                    <div className="space-y-3">
                      {category.permissions.map((permission) => {
                        const IconComponent = permission.icon;
                        return (
                          <div key={permission.key} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-4 w-4 text-gray-500" />
                              <div>
                                <p className="text-sm font-medium">{permission.label}</p>
                                <p className="text-xs text-gray-500">{permission.description}</p>
                              </div>
                            </div>
                            <Switch 
                              checked={selectedMember.permissions[permission.key]}
                              onCheckedChange={(checked) => 
                                updateMemberPermissions(selectedMember.id, permission.key, checked)
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsPermissionDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Bulk Approve Access
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}