import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Mail, 
  Send, 
  Search, 
  Filter, 
  MoreHorizontal,
  Reply,
  Forward,
  Trash2,
  Archive,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Paperclip,
  Calendar,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const messages = [
  {
    id: 'MSG001',
    from: 'Sarah Thompson',
    fromId: 'LEM001001',
    fromRole: 'Regional Director',
    to: 'John Doe',
    toId: 'LEM001234',
    subject: 'Upcoming Regional Conference',
    preview: 'Hi John, I wanted to reach out about the upcoming regional conference scheduled for next month...',
    content: `Hi John,

I wanted to reach out about the upcoming regional conference scheduled for next month. As a chapter president, your participation would be invaluable.

The conference will cover:
- Leadership development workshops
- Financial management training
- New member recruitment strategies

Please let me know if you can attend.

Best regards,
Sarah Thompson
Regional Director, Southeast Region`,
    timestamp: '2024-12-23T10:30:00Z',
    read: false,
    starred: false,
    archived: false,
    priority: 'normal',
    type: 'official',
    attachments: ['Conference_Agenda.pdf'],
    adminViewed: false,
    adminNotes: ''
  },
  {
    id: 'MSG002',
    from: 'Michael Brown',
    fromId: 'LEM001236',
    fromRole: 'National Treasurer',
    to: 'John Doe',
    toId: 'LEM001234',
    subject: 'Q4 Financial Reports Available',
    preview: 'The Q4 financial reports are now available for chapter presidents to review...',
    content: `Dear John,

The Q4 financial reports are now available for chapter presidents to review. Please log into the financial portal to access:

- Chapter budget summary
- Dues collection report
- Expense breakdown
- Fundraising performance

If you have any questions about the reports, please don't hesitate to reach out.

Best,
Michael Brown
National Treasurer`,
    timestamp: '2024-12-22T14:15:00Z',
    read: true,
    starred: true,
    archived: false,
    priority: 'high',
    type: 'financial',
    attachments: [],
    adminViewed: true,
    adminNotes: 'Financial report access - standard communication'
  },
  {
    id: 'MSG003',
    from: 'Lambda Empire System',
    fromId: 'SYSTEM',
    fromRole: 'System',
    to: 'John Doe',
    toId: 'LEM001234',
    subject: 'Service Hours Reminder',
    preview: 'This is a friendly reminder that you have 5 service hours remaining to complete this quarter...',
    content: `Dear John,

This is a friendly reminder that you have 5 service hours remaining to complete this quarter.

Current status:
- Completed: 15 hours
- Remaining: 5 hours
- Deadline: December 31, 2024

You can log your service hours through the Service Hours portal in your dashboard.

Thank you for your continued service to the community.

Lambda Empire Management System`,
    timestamp: '2024-12-21T09:00:00Z',
    read: true,
    starred: false,
    archived: false,
    priority: 'normal',
    type: 'system',
    attachments: [],
    adminViewed: false,
    adminNotes: ''
  },
  {
    id: 'MSG004',
    from: 'Marcus Johnson',
    fromId: 'LEM000001',
    fromRole: 'National President',
    to: 'John Doe',
    toId: 'LEM001234',
    subject: 'Personal Note - Leadership Recognition',
    preview: 'John, I wanted to personally reach out to commend you on your exceptional leadership...',
    content: `Dear John,

I wanted to personally reach out to commend you on your exceptional leadership of the Alpha Chapter this year. Your innovative fundraising initiatives and member engagement programs have been outstanding.

I'm considering you for a regional leadership role. Would you be interested in discussing this opportunity?

Please keep this confidential for now.

Warm regards,
Marcus Johnson
National President`,
    timestamp: '2024-12-20T16:45:00Z',
    read: false,
    starred: false,
    archived: false,
    priority: 'confidential',
    type: 'personal',
    attachments: [],
    adminViewed: false,
    adminNotes: ''
  }
];

export default function MemberInbox() {
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.preview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || message.type === filterType;
    const matchesPriority = filterPriority === 'all' || message.priority === filterPriority;
    const matchesRead = !showUnreadOnly || !message.read;
    
    return matchesSearch && matchesType && matchesPriority && matchesRead;
  });

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'official': return 'bg-blue-100 text-blue-800';
      case 'financial': return 'bg-green-100 text-green-800';
      case 'personal': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'confidential': return 'bg-orange-100 text-orange-800';
      case 'normal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const markAsRead = (messageId) => {
    // This would typically update the backend
    console.log(`Marking message ${messageId} as read`);
  };

  const toggleStar = (messageId) => {
    // This would typically update the backend
    console.log(`Toggling star for message ${messageId}`);
  };

  const archiveMessage = (messageId) => {
    // This would typically update the backend
    console.log(`Archiving message ${messageId}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Mail className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Inbox</h1>
              <p className="text-white/90 mt-1">Personal messages and communications</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              onClick={() => setIsComposeOpen(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
        </div>
      </div>

      {/* Inbox Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {messages.filter(m => !m.read).length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Starred</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {messages.filter(m => m.starred).length}
            </div>
            <p className="text-xs text-muted-foreground">Important</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {messages.filter(m => m.priority === 'high' || m.priority === 'confidential').length}
            </div>
            <p className="text-xs text-muted-foreground">Urgent items</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Messages</CardTitle>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showUnreadOnly}
                  onCheckedChange={setShowUnreadOnly}
                />
                <Label className="text-sm">Unread only</Label>
              </div>
            </div>
            <CardDescription>Your personal message inbox</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="space-y-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="official">Official</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="confidential">Confidential</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Message List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedMessage?.id === message.id ? 'bg-blue-50 border-blue-200' : ''
                  } ${!message.read ? 'border-l-4 border-l-blue-500' : ''}`}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (!message.read) markAsRead(message.id);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className={`text-sm font-medium truncate ${!message.read ? 'font-bold' : ''}`}>
                          {message.from}
                        </p>
                        {message.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      </div>
                      <p className={`text-sm truncate ${!message.read ? 'font-semibold' : 'text-gray-600'}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {message.preview}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getMessageTypeColor(message.type)} variant="outline">
                          {message.type}
                        </Badge>
                        {message.priority !== 'normal' && (
                          <Badge className={getPriorityColor(message.priority)} variant="outline">
                            {message.priority}
                          </Badge>
                        )}
                        {message.attachments.length > 0 && (
                          <Paperclip className="h-3 w-3 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleDateString()}
                      </span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleStar(message.id)}>
                            {message.starred ? (
                              <>
                                <StarOff className="h-4 w-4 mr-2" />
                                Unstar
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4 mr-2" />
                                Star
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => archiveMessage(message.id)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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

        {/* Message Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            {selectedMessage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{selectedMessage.subject}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-lambda-purple text-white text-xs">
                          {selectedMessage.from.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{selectedMessage.from}</p>
                        <p className="text-xs text-gray-500">{selectedMessage.fromRole}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getMessageTypeColor(selectedMessage.type)}>
                      {selectedMessage.type}
                    </Badge>
                    {selectedMessage.priority !== 'normal' && (
                      <Badge className={getPriorityColor(selectedMessage.priority)}>
                        {selectedMessage.priority}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Received: {new Date(selectedMessage.timestamp).toLocaleString()}
                  </span>
                  <div className="flex items-center gap-4">
                    {selectedMessage.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-4 w-4" />
                        {selectedMessage.attachments.length} attachment(s)
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStar(selectedMessage.id)}
                    >
                      {selectedMessage.starred ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <CardTitle>Select a message</CardTitle>
                <CardDescription>Choose a message from the list to view its content</CardDescription>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Message Content */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {selectedMessage.content}
                  </pre>
                </div>

                {/* Attachments */}
                {selectedMessage.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Attachments</h4>
                    <div className="space-y-2">
                      {selectedMessage.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{attachment}</span>
                          <Button size="sm" variant="outline" className="ml-auto">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                  <Button variant="outline">
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </Button>
                  <Button variant="outline" onClick={() => archiveMessage(selectedMessage.id)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                  <Button variant="outline" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                <div className="text-center">
                  <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a message to view its content</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Compose Message Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Send a message to another Lambda Empire member
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>To</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Thompson (Regional Director)</SelectItem>
                  <SelectItem value="michael">Michael Brown (National Treasurer)</SelectItem>
                  <SelectItem value="marcus">Marcus Johnson (National President)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Subject</Label>
              <Input placeholder="Enter message subject" />
            </div>
            
            <div>
              <Label>Priority</Label>
              <Select defaultValue="normal">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="confidential">Confidential</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Message</Label>
              <Textarea 
                placeholder="Type your message here..."
                rows={8}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsComposeOpen(false)}>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}