import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Shield, 
  Eye, 
  Search, 
  Filter, 
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  User,
  FileText,
  Flag,
  MessageSquare,
  Users,
  TrendingUp,
  Calendar,
  Star,
  Archive,
  Trash2
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

// All member messages across the system
const allMessages = [
  {
    id: 'MSG001',
    from: 'Sarah Thompson',
    fromId: 'LEM001001',
    fromRole: 'Regional Director',
    to: 'John Doe',
    toId: 'LEM001234',
    toRole: 'Chapter President',
    subject: 'Upcoming Regional Conference',
    content: 'Hi John, I wanted to reach out about the upcoming regional conference...',
    timestamp: '2024-12-23T10:30:00Z',
    read: false,
    priority: 'normal',
    type: 'official',
    flagged: false,
    adminViewed: false,
    adminNotes: '',
    riskLevel: 'low'
  },
  {
    id: 'MSG002',
    from: 'Michael Brown',
    fromId: 'LEM001236',
    fromRole: 'National Treasurer',
    to: 'John Doe',
    toId: 'LEM001234',
    toRole: 'Chapter President',
    subject: 'Q4 Financial Reports Available',
    content: 'Dear John, The Q4 financial reports are now available...',
    timestamp: '2024-12-22T14:15:00Z',
    read: true,
    priority: 'high',
    type: 'financial',
    flagged: false,
    adminViewed: true,
    adminNotes: 'Standard financial communication',
    riskLevel: 'low'
  },
  {
    id: 'MSG003',
    from: 'David Johnson',
    fromId: 'LEM001237',
    fromRole: 'Chapter Member',
    to: 'Sarah Thompson',
    toId: 'LEM001001',
    toRole: 'Regional Director',
    subject: 'Concerns about Chapter Leadership',
    content: 'Sarah, I have some concerns about how our chapter is being managed...',
    timestamp: '2024-12-21T16:20:00Z',
    read: false,
    priority: 'confidential',
    type: 'complaint',
    flagged: true,
    adminViewed: false,
    adminNotes: '',
    riskLevel: 'medium'
  },
  {
    id: 'MSG004',
    from: 'Anonymous',
    fromId: 'ANONYMOUS',
    fromRole: 'Member',
    to: 'Marcus Johnson',
    toId: 'LEM000001',
    toRole: 'National President',
    subject: 'Financial Irregularities Report',
    content: 'I wish to report potential financial irregularities in the Southeast region...',
    timestamp: '2024-12-20T11:30:00Z',
    read: false,
    priority: 'confidential',
    type: 'whistleblower',
    flagged: true,
    adminViewed: false,
    adminNotes: '',
    riskLevel: 'high'
  },
  {
    id: 'MSG005',
    from: 'Lisa Garcia',
    fromId: 'LEM001003',
    fromRole: 'Regional Director',
    to: 'Multiple Recipients',
    toId: 'MULTIPLE',
    toRole: 'Chapter Presidents',
    subject: 'Midwest Region Monthly Update',
    content: 'Dear Chapter Presidents, Here is the monthly update for the Midwest region...',
    timestamp: '2024-12-19T09:00:00Z',
    read: true,
    priority: 'normal',
    type: 'official',
    flagged: false,
    adminViewed: true,
    adminNotes: 'Regular regional communication',
    riskLevel: 'low'
  }
];

const memberInboxes = [
  {
    memberId: 'LEM001234',
    memberName: 'John Doe',
    memberRole: 'Chapter President',
    totalMessages: 15,
    unreadMessages: 3,
    flaggedMessages: 0,
    lastActivity: '2024-12-23T10:30:00Z',
    riskLevel: 'low'
  },
  {
    memberId: 'LEM001001',
    memberName: 'Sarah Thompson',
    memberRole: 'Regional Director',
    totalMessages: 28,
    unreadMessages: 5,
    flaggedMessages: 1,
    lastActivity: '2024-12-23T08:15:00Z',
    riskLevel: 'medium'
  },
  {
    memberId: 'LEM001236',
    memberName: 'Michael Brown',
    memberRole: 'National Treasurer',
    totalMessages: 42,
    unreadMessages: 2,
    flaggedMessages: 0,
    lastActivity: '2024-12-22T16:45:00Z',
    riskLevel: 'low'
  },
  {
    memberId: 'LEM000001',
    memberName: 'Marcus Johnson',
    memberRole: 'National President',
    totalMessages: 67,
    unreadMessages: 8,
    flaggedMessages: 2,
    lastActivity: '2024-12-23T12:00:00Z',
    riskLevel: 'high'
  }
];

export default function AdminInboxMonitor() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);

  const filteredMessages = allMessages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || message.type === filterType;
    const matchesRisk = filterRisk === 'all' || message.riskLevel === filterRisk;
    const matchesFlagged = !showFlaggedOnly || message.flagged;
    
    return matchesSearch && matchesType && matchesRisk && matchesFlagged;
  });

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'official': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'complaint': return 'bg-orange-100 text-orange-800';
      case 'whistleblower': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const flagMessage = (messageId) => {
    console.log(`Flagging message ${messageId}`);
  };

  const addAdminNote = (messageId, note) => {
    console.log(`Adding admin note to message ${messageId}: ${note}`);
  };

  const markAsViewed = (messageId) => {
    console.log(`Marking message ${messageId} as admin viewed`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <Shield className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Inbox Monitor</h1>
            <p className="text-white/90 mt-1">Administrative oversight of member communications</p>
          </div>
        </div>
      </div>

      {/* Monitor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{allMessages.length}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Flagged Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {allMessages.filter(m => m.flagged).length}
            </div>
            <p className="text-xs text-muted-foreground">Require review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {allMessages.filter(m => m.riskLevel === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Priority review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unreviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {allMessages.filter(m => !m.adminViewed).length}
            </div>
            <p className="text-xs text-muted-foreground">Pending admin review</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Message Monitor</TabsTrigger>
          <TabsTrigger value="members">Member Inboxes</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Flagged Messages</CardTitle>
                <CardDescription>Messages requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allMessages.filter(m => m.flagged).map((message) => (
                    <div key={message.id} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{message.subject}</p>
                        <p className="text-xs text-gray-600">{message.from} → {message.to}</p>
                        <Badge className={getRiskLevelColor(message.riskLevel)} variant="outline">
                          {message.riskLevel} risk
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedMessage(message);
                          setIsMessageDialogOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Member Activity Summary</CardTitle>
                <CardDescription>Recent inbox activity by member</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {memberInboxes.map((member) => (
                    <div key={member.memberId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-lambda-purple text-white text-xs">
                            {member.memberName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.memberName}</p>
                          <p className="text-xs text-gray-600">{member.memberRole}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{member.totalMessages} messages</p>
                        <div className="flex items-center gap-2">
                          {member.unreadMessages > 0 && (
                            <Badge variant="outline">{member.unreadMessages} unread</Badge>
                          )}
                          {member.flaggedMessages > 0 && (
                            <Badge className="bg-red-100 text-red-800">{member.flaggedMessages} flagged</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Message Monitor Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Message Monitor</CardTitle>
                  <CardDescription>Monitor all member communications across the system</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={showFlaggedOnly}
                    onCheckedChange={setShowFlaggedOnly}
                  />
                  <Label className="text-sm">Flagged only</Label>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search messages, senders, recipients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Message Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="official">Official</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="complaint">Complaint</SelectItem>
                    <SelectItem value="whistleblower">Whistleblower</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Risk Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risk Levels</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Message List */}
              <div className="space-y-3">
                {filteredMessages.map((message) => (
                  <div key={message.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium">{message.subject}</h3>
                          {message.flagged && <Flag className="h-4 w-4 text-red-500" />}
                          {!message.adminViewed && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span><strong>From:</strong> {message.from} ({message.fromRole})</span>
                          <span><strong>To:</strong> {message.to} ({message.toRole})</span>
                          <span>{new Date(message.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getMessageTypeColor(message.type)}>
                            {message.type}
                          </Badge>
                          <Badge className={getRiskLevelColor(message.riskLevel)}>
                            {message.riskLevel} risk
                          </Badge>
                          {message.priority !== 'normal' && (
                            <Badge variant="outline">{message.priority}</Badge>
                          )}
                        </div>
                        {message.adminNotes && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                            <strong>Admin Note:</strong> {message.adminNotes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsMessageDialogOpen(true);
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => flagMessage(message.id)}>
                              <Flag className="h-4 w-4 mr-2" />
                              {message.flagged ? 'Unflag' : 'Flag'} Message
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => markAsViewed(message.id)}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Reviewed
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText className="h-4 w-4 mr-2" />
                              Generate Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Member Inboxes Tab */}
        <TabsContent value="members" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Inbox Overview</CardTitle>
              <CardDescription>Monitor individual member inbox activity and access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {memberInboxes.map((member) => (
                  <Card key={member.memberId} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-lambda-purple text-white">
                              {member.memberName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.memberName}</h3>
                            <p className="text-sm text-gray-600">{member.memberRole}</p>
                          </div>
                        </div>
                        <Badge className={getRiskLevelColor(member.riskLevel)}>
                          {member.riskLevel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Messages:</span>
                          <span className="font-medium">{member.totalMessages}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Unread:</span>
                          <span className="font-medium text-blue-600">{member.unreadMessages}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Flagged:</span>
                          <span className="font-medium text-red-600">{member.flaggedMessages}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Last Activity:</span>
                          <span className="text-gray-600">
                            {new Date(member.lastActivity).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4" 
                        size="sm"
                        onClick={() => {
                          setSelectedMember(member);
                          setIsMemberDialogOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3 mr-2" />
                        View Inbox
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message Detail Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
            <DialogDescription>
              Administrative review of member communication
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-6">
              {/* Message Header */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>From:</strong> {selectedMessage.from} ({selectedMessage.fromRole})
                  </div>
                  <div>
                    <strong>To:</strong> {selectedMessage.to} ({selectedMessage.toRole})
                  </div>
                  <div>
                    <strong>Subject:</strong> {selectedMessage.subject}
                  </div>
                  <div>
                    <strong>Timestamp:</strong> {new Date(selectedMessage.timestamp).toLocaleString()}
                  </div>
                  <div>
                    <strong>Type:</strong> 
                    <Badge className={getMessageTypeColor(selectedMessage.type)} variant="outline">
                      {selectedMessage.type}
                    </Badge>
                  </div>
                  <div>
                    <strong>Risk Level:</strong> 
                    <Badge className={getRiskLevelColor(selectedMessage.riskLevel)} variant="outline">
                      {selectedMessage.riskLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="font-medium mb-2">Message Content</h4>
                <div className="border rounded-lg p-4 bg-white">
                  <p className="text-sm whitespace-pre-wrap">{selectedMessage.content}</p>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="font-medium mb-2">Administrative Notes</h4>
                <Textarea 
                  placeholder="Add administrative notes about this message..."
                  defaultValue={selectedMessage.adminNotes}
                  rows={3}
                />
              </div>

              {/* Admin Actions */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">
                  <Flag className="h-4 w-4 mr-2" />
                  {selectedMessage.flagged ? 'Unflag' : 'Flag'} Message
                </Button>
                <Button variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Reviewed
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Escalate Issue
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setIsMessageDialogOpen(false)}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Member Inbox Dialog */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Inbox Access</DialogTitle>
            <DialogDescription>
              Administrative view of {selectedMember?.memberName}'s inbox
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* Member Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-lambda-purple text-white">
                    {selectedMember.memberName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedMember.memberName}</h3>
                  <p className="text-sm text-gray-600">{selectedMember.memberRole}</p>
                  <p className="text-sm text-gray-600">ID: {selectedMember.memberId}</p>
                </div>
                <div className="ml-auto">
                  <Badge className={getRiskLevelColor(selectedMember.riskLevel)}>
                    {selectedMember.riskLevel} risk
                  </Badge>
                </div>
              </div>

              {/* Inbox Messages */}
              <div>
                <h4 className="font-medium mb-4">Inbox Messages</h4>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allMessages
                    .filter(m => m.toId === selectedMember.memberId || m.fromId === selectedMember.memberId)
                    .map((message) => (
                    <div key={message.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{message.subject}</h5>
                          <p className="text-xs text-gray-600 mt-1">
                            {message.fromId === selectedMember.memberId ? 'Sent to' : 'Received from'}: {' '}
                            {message.fromId === selectedMember.memberId ? message.to : message.from}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getMessageTypeColor(message.type)} variant="outline">
                              {message.type}
                            </Badge>
                            {message.flagged && (
                              <Badge className="bg-red-100 text-red-800">Flagged</Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Export Inbox
                </Button>
                <Button variant="outline">
                  <Flag className="h-4 w-4 mr-2" />
                  Flag All Messages
                </Button>
                <Button variant="outline" className="text-red-600">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Report Suspicious Activity
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMemberDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}