import { useState, useEffect } from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  MessageSquare, 
  Mail, 
  Send, 
  History, 
  Users, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Phone,
  Edit,
  List,
  Calendar,
  UserCheck,
  Bell,
  Smartphone,
  Globe,
  Settings,
  Megaphone,
  ExternalLink
} from 'lucide-react';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  chapter?: string;
  status: string;
  role?: string;
}

interface Communication {
  id: string;
  type: string;
  subject: string;
  recipients: string;
  status: string;
  created_at: string;
  priority?: string;
  sender_id?: string;
}

interface GroupMeSettings {
  connected: boolean;
  botId: string;
  groupName: string;
  groupId: string;
  lastSync: string;
}

export default function Communications() {
  const { user } = useOptimizedAuth();
  const { toast } = useToast();
  
  // Real-time data hooks
  const { data: profiles = [], loading: profilesLoading } = useRealtimeData('profiles');
  const { data: communications = [], loading: communicationsLoading } = useRealtimeData('communications');
  
  // Component state
  const [activeTab, setActiveTab] = useState('announcements');
  const [smsMessage, setSmsMessage] = useState('');
  const [smsRecipients, setSmsRecipients] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [pushTitle, setPushTitle] = useState('');
  const [pushMessage, setPushMessage] = useState('');
  const [pushRecipients, setPushRecipients] = useState([]);
  const [pushPriority, setPushPriority] = useState('medium');
  const [groupMeMessage, setGroupMeMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');
  const [isGroupMeDialogOpen, setIsGroupMeDialogOpen] = useState(false);
  const [groupMeSettings, setGroupMeSettings] = useState<GroupMeSettings>({
    connected: false,
    botId: '',
    groupName: '',
    groupId: '',
    lastSync: ''
  });
  const [membersOnly, setMembersOnly] = useState(true);

  // Process members data
  const members: Member[] = profiles.map(profile => ({
    id: profile.id,
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    chapter: profile.chapter || '',
    status: profile.status || 'Active',
    role: profile.can_approve_members ? 'admin' : 'member'
  }));

  const currentUserProfile = profiles.find(p => p.id === user?.id);
  const userRole = currentUserProfile?.can_approve_members ? 'admin' : 'member';
  const isMember = !!currentUserProfile;

  // Helper function to log communications
  const logCommunication = async (type: string, subject: string, recipients: string[], status: string = 'Sent', priority: string = 'medium') => {
    try {
      const recipientNames = recipients.map(id => {
        if (id.startsWith('all_')) {
          return id.replace('all_', '').replace('_', ' ').toUpperCase();
        }
        const member = members.find(m => m.id === id);
        return member ? `${member.first_name} ${member.last_name}` : 'Unknown';
      }).join(', ');

      await supabase.from('communications').insert({
        type,
        subject,
        recipients: recipientNames,
        status,
        priority,
        sender_id: user?.id
      });
    } catch (error) {
      console.error('Failed to log communication:', error);
    }
  };

  const handleSendPushAlert = async () => {
    setSendError('');
    setSendSuccess(false);
    setIsSending(true);

    if (!pushTitle.trim() || !pushMessage.trim() || pushRecipients.length === 0) {
      setSendError('Title, message, and recipients are required for push alerts.');
      setIsSending(false);
      return;
    }

    console.log('Sending Push Alert:', { pushTitle, pushMessage, pushRecipients, pushPriority });
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate sending push notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(pushTitle, {
          body: pushMessage,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      }
      
      setSendSuccess(true);
      setPushTitle('');
      setPushMessage('');
      setPushRecipients([]);
      setPushPriority('medium');
      
      // Log communication to database
      await logCommunication('Push Alert', pushTitle, pushRecipients, 'Sent', pushPriority);
      
      toast({
        title: "Push Alert Sent",
        description: `Push alert sent to ${pushRecipients.length} recipient(s)`,
      });
    } catch (error) {
      setSendError('Failed to send push alert. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendSms = async () => {
    setSendError('');
    setSendSuccess(false);
    setIsSending(true);

    if (!smsMessage.trim() || smsRecipients.length === 0) {
      setSendError('Message and recipients are required.');
      setIsSending(false);
      return;
    }

    console.log('Sending SMS:', { smsMessage, smsRecipients });
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSendSuccess(true);
      setSmsMessage('');
      setSmsRecipients([]);
      
      // Log communication to database
      await logCommunication('SMS', smsMessage.substring(0, 50) + '...', smsRecipients, 'Sent');
      
      toast({
        title: "SMS Sent",
        description: `SMS sent to ${smsRecipients.length} recipient(s)`,
      });
    } catch (error) {
      setSendError('Failed to send SMS. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendEmail = async () => {
    setSendError('');
    setSendSuccess(false);
    setIsSending(true);

    if (!emailSubject.trim() || !emailBody.trim() || emailRecipients.length === 0) {
      setSendError('Subject, body, and recipients are required.');
      setIsSending(false);
      return;
    }

    console.log('Sending Email:', { emailSubject, emailBody, emailRecipients });
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSendSuccess(true);
      setEmailSubject('');
      setEmailBody('');
      setEmailRecipients([]);
      
      // Log communication to database
      await logCommunication('Email', emailSubject, emailRecipients, 'Sent');
      
      toast({
        title: "Email Sent",
        description: `Email sent to ${emailRecipients.length} recipient(s)`,
      });
    } catch (error) {
      setSendError('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendGroupMe = async () => {
    setSendError('');
    setSendSuccess(false);
    setIsSending(true);

    if (!groupMeMessage.trim()) {
      setSendError('Message is required for GroupMe.');
      setIsSending(false);
      return;
    }

    if (!groupMeSettings.connected) {
      setSendError('GroupMe integration is not connected.');
      setIsSending(false);
      return;
    }

    console.log('Sending GroupMe Message:', { groupMeMessage });
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSendSuccess(true);
      setGroupMeMessage('');
      
      // Log communication to database
      await logCommunication('GroupMe', groupMeMessage.substring(0, 50) + '...', [groupMeSettings.groupName], 'Sent');
      
      toast({
        title: "GroupMe Message Sent",
        description: `Message sent to ${groupMeSettings.groupName}`,
      });
    } catch (error) {
      setSendError('Failed to send GroupMe message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const connectGroupMe = () => {
    // In real app, this would redirect to GroupMe OAuth
    console.log('Connecting to GroupMe...');
    setGroupMeSettings(prev => ({ ...prev, connected: true }));
    setIsGroupMeDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SMS': return <Phone className="h-4 w-4" />;
      case 'Email': return <Mail className="h-4 w-4" />;
      case 'Push Alert': return <Bell className="h-4 w-4" />;
      case 'GroupMe': return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  // Access control for non-members
  if (!isMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              This page is only accessible to Lambda Empire members. Please log in with your member credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.href = '/login'} className="w-full">
              Member Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Communications Dashboard</h1>
            <p className="text-white/90 mt-1">Send announcements, alerts, and manage member communications</p>
          </div>
        </div>
      </div>

      {/* Member Access Notice */}
      <Alert>
        <UserCheck className="h-4 w-4" />
        <AlertDescription>
          <strong>Member-Only Access:</strong> All communication features are restricted to verified Lambda Empire members only. Non-members cannot access any information on this platform.
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="announcements">Push Alerts</TabsTrigger>
          <TabsTrigger value="sms">SMS</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="groupme">GroupMe</TabsTrigger>
          <TabsTrigger value="log">Communications Log</TabsTrigger>
        </TabsList>

        {/* Push Alerts Tab */}
        <TabsContent value="announcements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Organization Push Alerts
              </CardTitle>
              <CardDescription>
                Send instant push notifications to members for urgent announcements and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Members-Only Alerts</span>
                  </div>
                  <Switch checked={membersOnly} onCheckedChange={setMembersOnly} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pushTitle">Alert Title *</Label>
                    <Input
                      id="pushTitle"
                      placeholder="Enter alert title"
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      maxLength={50}
                    />
                    <p className="text-sm text-gray-500 text-right">
                      {pushTitle.length}/50 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pushPriority">Priority Level</Label>
                    <Select value={pushPriority} onValueChange={setPushPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">🔵 Low Priority</SelectItem>
                        <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                        <SelectItem value="high">🔴 High Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pushMessage">Alert Message *</Label>
                  <Textarea
                    id="pushMessage"
                    placeholder="Type your push alert message here..."
                    value={pushMessage}
                    onChange={(e) => setPushMessage(e.target.value)}
                    className="min-h-[100px]"
                    maxLength={200}
                  />
                  <p className="text-sm text-gray-500 text-right">
                    {pushMessage.length}/200 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pushRecipients">Recipients *</Label>
                  <Select
                    value={pushRecipients}
                    onValueChange={(value) => setPushRecipients(Array.isArray(value) ? value : [value])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="all_active">All Active Members</SelectItem>
                      <SelectItem value="all_inactive">All Inactive Members</SelectItem>
                      <SelectItem value="all_admins">All Admins</SelectItem>
                      {mockMembers.filter(member => member.status === 'Active').map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.chapter})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sendError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {sendError}
                    </AlertDescription>
                  </Alert>
                )}
                {sendSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Push alert sent successfully to members!
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleSendPushAlert} 
                  disabled={isSending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Alert...
                    </div>
                  ) : (
                    <>
                      <Bell className="h-4 w-4 mr-2" />
                      Send Push Alert
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SMS Notifications Tab */}
        <TabsContent value="sms" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send SMS Notification</CardTitle>
              <CardDescription>Compose and send instant SMS messages to members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smsMessage">Message *</Label>
                  <Textarea
                    id="smsMessage"
                    placeholder="Type your SMS message here..."
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="min-h-[100px]"
                    maxLength={160}
                  />
                  <p className="text-sm text-gray-500 text-right">
                    {smsMessage.length}/160 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="smsRecipients">Recipients *</Label>
                  <Select
                    value={smsRecipients}
                    onValueChange={(value) => setSmsRecipients(Array.isArray(value) ? value : [value])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="all_active">All Active Members</SelectItem>
                      <SelectItem value="all_inactive">All Inactive Members</SelectItem>
                      <SelectItem value="all_admins">All Admins</SelectItem>
                      {mockMembers.filter(member => member.status === 'Active').map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.chapter})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sendError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {sendError}
                    </AlertDescription>
                  </Alert>
                )}
                {sendSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      SMS sent successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleSendSms} 
                  disabled={isSending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending SMS...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send SMS
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Campaigns Tab */}
        <TabsContent value="email" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Email Campaign</CardTitle>
              <CardDescription>Design and send rich email campaigns to members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailSubject">Subject *</Label>
                  <Input
                    id="emailSubject"
                    placeholder="Enter email subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailBody">Email Body *</Label>
                  <Textarea
                    id="emailBody"
                    placeholder="Compose your email content here..."
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="min-h-[200px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailRecipients">Recipients *</Label>
                  <Select
                    value={emailRecipients}
                    onValueChange={(value) => setEmailRecipients(Array.isArray(value) ? value : [value])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="all_active">All Active Members</SelectItem>
                      <SelectItem value="all_inactive">All Inactive Members</SelectItem>
                      <SelectItem value="all_admins">All Admins</SelectItem>
                      {mockMembers.filter(member => member.status === 'Active').map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.chapter})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sendError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {sendError}
                    </AlertDescription>
                  </Alert>
                )}
                {sendSuccess && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Email campaign sent successfully!
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handleSendEmail} 
                  disabled={isSending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending Email...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GroupMe Integration Tab */}
        <TabsContent value="groupme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                GroupMe Integration
              </CardTitle>
              <CardDescription>
                Send messages directly to your GroupMe chat groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* GroupMe Connection Status */}
                <div className={`p-4 rounded-lg border-2 ${groupMeSettings.connected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${groupMeSettings.connected ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <MessageSquare className={`h-4 w-4 ${groupMeSettings.connected ? 'text-green-600' : 'text-yellow-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {groupMeSettings.connected ? 'Connected to GroupMe' : 'GroupMe Not Connected'}
                        </h3>
                        {groupMeSettings.connected ? (
                          <p className="text-sm text-gray-600">
                            Group: {groupMeSettings.groupName}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Connect your GroupMe account to send messages
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => setIsGroupMeDialogOpen(true)}
                      variant={groupMeSettings.connected ? "outline" : "default"}
                      size="sm"
                    >
                      {groupMeSettings.connected ? (
                        <>
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {groupMeSettings.connected && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="groupMeMessage">Message *</Label>
                      <Textarea
                        id="groupMeMessage"
                        placeholder="Type your GroupMe message here..."
                        value={groupMeMessage}
                        onChange={(e) => setGroupMeMessage(e.target.value)}
                        className="min-h-[100px]"
                        maxLength={1000}
                      />
                      <p className="text-sm text-gray-500 text-right">
                        {groupMeMessage.length}/1000 characters
                      </p>
                    </div>

                    {sendError && (
                      <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          {sendError}
                        </AlertDescription>
                      </Alert>
                    )}
                    {sendSuccess && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700">
                          Message sent to GroupMe successfully!
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      onClick={handleSendGroupMe} 
                      disabled={isSending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending to GroupMe...
                        </div>
                      ) : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send to GroupMe
                        </>
                      )}
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Communications Log Tab */}
        <TabsContent value="log" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communications Log</CardTitle>
              <CardDescription>View a history of all sent communications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommunicationsLog.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <List className="h-12 w-12 mx-auto mb-4" />
                    <p>No communications sent yet.</p>
                  </div>
                ) : (
                  mockCommunicationsLog.map(comm => (
                    <div key={comm.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-full bg-gray-100">
                          {getTypeIcon(comm.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{comm.subject}</h3>
                            <Badge className={getPriorityColor(comm.priority)}>
                              {comm.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">To: {comm.recipients}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comm.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{comm.type}</Badge>
                        <Badge className={getStatusColor(comm.status)}>
                          {comm.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* GroupMe Settings Dialog */}
      <Dialog open={isGroupMeDialogOpen} onOpenChange={setIsGroupMeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              GroupMe Integration
            </DialogTitle>
            <DialogDescription>
              Connect your GroupMe account to send messages to your organization's chat groups
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!groupMeSettings.connected ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium mb-2">Connect to GroupMe</h3>
                  <p className="text-sm text-gray-600">
                    Authorize Lambda Empire to send messages to your GroupMe groups
                  </p>
                </div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    You'll be redirected to GroupMe to authorize this connection. Only group administrators can set up bot integration.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Connected Successfully</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Group:</strong> {groupMeSettings.groupName}</p>
                    <p><strong>Bot ID:</strong> {groupMeSettings.botId}</p>
                    <p><strong>Last Sync:</strong> {new Date(groupMeSettings.lastSync).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsGroupMeDialogOpen(false)}
            >
              Cancel
            </Button>
            {!groupMeSettings.connected ? (
              <Button onClick={connectGroupMe} className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect to GroupMe
              </Button>
            ) : (
              <Button 
                onClick={() => setGroupMeSettings(prev => ({ ...prev, connected: false }))}
                variant="destructive"
              >
                Disconnect
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}