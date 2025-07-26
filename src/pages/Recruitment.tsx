import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  UserPlus, 
  Users, 
  FileText, 
  CheckCircle, 
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  AlertCircle,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Filter,
  Search
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useState } from 'react';

const applications = [
  {
    id: 'APP001',
    name: 'Marcus Williams',
    email: 'marcus.w@email.com',
    phone: '(555) 987-6543',
    age: 24,
    education: 'MBA, Harvard Business School',
    profession: 'Marketing Manager',
    location: 'New York, NY',
    status: 'Under Review',
    submittedDate: '2024-12-20',
    interviewScheduled: true,
    interviewDate: '2024-12-28',
    score: 85,
    stage: 'Interview',
    notes: 'Strong leadership background, excellent communication skills'
  },
  {
    id: 'APP002',
    name: 'Jasmine Carter',
    email: 'j.carter@email.com',
    phone: '(555) 876-5432',
    age: 26,
    education: 'JD, Yale Law School',
    profession: 'Attorney',
    location: 'Atlanta, GA',
    status: 'Approved',
    submittedDate: '2024-12-15',
    interviewScheduled: true,
    interviewDate: '2024-12-22',
    score: 92,
    stage: 'Pledge',
    notes: 'Outstanding candidate, strong community involvement'
  },
  {
    id: 'APP003',
    name: 'David Johnson',
    email: 'david.j@email.com',
    phone: '(555) 765-4321',
    age: 23,
    education: 'BS Computer Science, MIT',
    profession: 'Software Engineer',
    location: 'San Francisco, CA',
    status: 'Pending',
    submittedDate: '2024-12-22',
    interviewScheduled: false,
    interviewDate: null,
    score: 78,
    stage: 'Application',
    notes: 'Technical skills excellent, needs leadership development'
  }
];

const pledges = [
  {
    id: 'PLG001',
    name: 'Jasmine Carter',
    email: 'j.carter@email.com',
    startDate: '2024-12-23',
    progress: 75,
    currentPhase: 'Community Service',
    requirements: {
      orientation: { completed: true, date: '2024-12-23' },
      communityService: { completed: false, hours: 15, required: 20 },
      mentorship: { completed: true, sessions: 8, required: 8 },
      education: { completed: false, modules: 3, required: 5 },
      finalReview: { completed: false, scheduled: '2025-01-15' }
    },
    mentor: 'Sarah Thompson',
    chapter: 'Alpha Chapter'
  },
  {
    id: 'PLG002',
    name: 'Robert Davis',
    email: 'r.davis@email.com',
    startDate: '2024-11-15',
    progress: 95,
    currentPhase: 'Final Review',
    requirements: {
      orientation: { completed: true, date: '2024-11-15' },
      communityService: { completed: true, hours: 25, required: 20 },
      mentorship: { completed: true, sessions: 8, required: 8 },
      education: { completed: true, modules: 5, required: 5 },
      finalReview: { completed: false, scheduled: '2025-01-05' }
    },
    mentor: 'Michael Brown',
    chapter: 'Beta Chapter'
  }
];

export default function Recruitment() {
  const [activeTab, setActiveTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserPlus className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Recruitment Center</h1>
              <p className="text-white/90 mt-1">Comprehensive recruitment and pledge management system</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Interview
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">47</div>
            <p className="text-xs text-muted-foreground">+8 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground">Next: Tomorrow</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Pledges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground">2 graduating soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Acceptance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">68%</div>
            <p className="text-xs text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="pledges">Pledge Tracking</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Membership Applications</CardTitle>
                  <CardDescription>Review and manage incoming applications</CardDescription>
                </div>
                <Button>
                  <FileText className="h-4 w-4 mr-2" />
                  Customize Application
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under review">Under Review</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Applications List */}
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {application.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{application.name}</h3>
                          <p className="text-sm text-gray-600">{application.id} • Age {application.age}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={
                              application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              application.status === 'Under Review' ? 'bg-blue-100 text-blue-800' :
                              application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {application.status}
                            </Badge>
                            <Badge variant="outline">{application.stage}</Badge>
                            {application.interviewScheduled && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Interview: {new Date(application.interviewDate!).toLocaleDateString()}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <div className="text-lg font-bold text-purple-600">{application.score}%</div>
                          <p className="text-xs text-gray-500">Score</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Application
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Schedule Interview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Reject
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{application.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{application.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{application.location}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span>{application.education}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-gray-500" />
                          <span>{application.profession}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p><span className="font-medium">Submitted:</span> {new Date(application.submittedDate).toLocaleDateString()}</p>
                        <p className="text-gray-600 text-xs">{application.notes}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Interview
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Interviews Tab */}
        <TabsContent value="interviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Interview Schedule</CardTitle>
              <CardDescription>Manage interview appointments and evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Upcoming Interviews</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule New
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Marcus Williams</p>
                          <p className="text-sm text-gray-600">December 28, 2024 • 2:00 PM</p>
                          <p className="text-xs text-gray-500">Panel Interview • Conference Room A</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Reschedule
                        </Button>
                        <Button size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Jasmine Carter</p>
                          <p className="text-sm text-gray-600">December 22, 2024 • 10:00 AM</p>
                          <p className="text-xs text-gray-500">Completed • Score: 92/100</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">David Johnson</p>
                          <p className="text-sm text-gray-600">Not Scheduled</p>
                          <p className="text-xs text-gray-500">Application under review</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pledge Tracking Tab */}
        <TabsContent value="pledges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Pledges</CardTitle>
              <CardDescription>Track pledge progress and requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {pledges.map((pledge) => (
                  <div key={pledge.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-lambda-purple text-white">
                            {pledge.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-lg">{pledge.name}</h3>
                          <p className="text-sm text-gray-600">{pledge.id} • {pledge.chapter}</p>
                          <p className="text-sm text-gray-600">Mentor: {pledge.mentor}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-lambda-purple">{pledge.progress}%</div>
                        <p className="text-sm text-gray-600">Complete</p>
                        <Badge className="mt-1">{pledge.currentPhase}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Overall Progress</span>
                        <span>{pledge.progress}%</span>
                      </div>
                      <Progress value={pledge.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className={`p-3 rounded-lg border ${pledge.requirements.orientation.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {pledge.requirements.orientation.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="text-sm font-medium">Orientation</span>
                        </div>
                        {pledge.requirements.orientation.completed && (
                          <p className="text-xs text-gray-600">
                            Completed: {new Date(pledge.requirements.orientation.date).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className={`p-3 rounded-lg border ${pledge.requirements.communityService.completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {pledge.requirements.communityService.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm font-medium">Service Hours</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {pledge.requirements.communityService.hours}/{pledge.requirements.communityService.required} hours
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg border ${pledge.requirements.mentorship.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {pledge.requirements.mentorship.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-500" />
                          )}
                          <span className="text-sm font-medium">Mentorship</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {pledge.requirements.mentorship.sessions}/{pledge.requirements.mentorship.required} sessions
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg border ${pledge.requirements.education.completed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {pledge.requirements.education.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm font-medium">Education</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          {pledge.requirements.education.modules}/{pledge.requirements.education.required} modules
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg border ${pledge.requirements.finalReview.completed ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {pledge.requirements.finalReview.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Calendar className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="text-sm font-medium">Final Review</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Scheduled: {new Date(pledge.requirements.finalReview.scheduled).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Update Progress
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3 mr-1" />
                        Contact Pledge
                      </Button>
                      <Button size="sm" variant="outline">
                        <User className="h-3 w-3 mr-1" />
                        Assign Mentor
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
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Form Settings</CardTitle>
                <CardDescription>Customize the membership application form</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Application Title</label>
                  <Input defaultValue="Lambda Empire Membership Application" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Welcome Message</label>
                  <Textarea 
                    defaultValue="Thank you for your interest in joining Lambda Empire. Please complete this application thoroughly."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Fields</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Personal Information</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Educational Background</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Professional Experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Community Involvement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">References</span>
                    </div>
                  </div>
                </div>
                <Button>Save Application Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interview Settings</CardTitle>
                <CardDescription>Configure interview process and scheduling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Duration</label>
                  <Select defaultValue="60">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interview Type</label>
                  <Select defaultValue="panel">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual Interview</SelectItem>
                      <SelectItem value="panel">Panel Interview</SelectItem>
                      <SelectItem value="group">Group Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Available Time Slots</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Weekday Mornings (9 AM - 12 PM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Weekday Afternoons (1 PM - 5 PM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Weekday Evenings (6 PM - 8 PM)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Saturday Mornings (9 AM - 12 PM)</span>
                    </div>
                  </div>
                </div>
                <Button>Save Interview Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pledge Requirements</CardTitle>
                <CardDescription>Configure pledge process and requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pledge Period Duration</label>
                  <Select defaultValue="8">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 weeks</SelectItem>
                      <SelectItem value="8">8 weeks</SelectItem>
                      <SelectItem value="10">10 weeks</SelectItem>
                      <SelectItem value="12">12 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Service Hours</label>
                  <Input type="number" defaultValue="20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Mentorship Sessions</label>
                  <Input type="number" defaultValue="8" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Required Education Modules</label>
                  <Input type="number" defaultValue="5" />
                </div>
                <Button>Save Pledge Settings</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure automated notifications and reminders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">New Application Notifications</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Interview Reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Pledge Progress Updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Weekly Summary Reports</span>
                  </div>
                </div>
                <Button>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}