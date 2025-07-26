import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  UserCheck
} from 'lucide-react';

// Mock data for members and communication history
const mockMembers = [
  { id: 'LEM001', name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', chapter: 'Alpha', status: 'Active', role: 'member' },
  { id: 'LEM002', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '098-765-4321', chapter: 'Alpha', status: 'Active', role: 'member' },
  { id: 'LEM003', name: 'Michael Brown', email: 'michael.b@example.com', phone: '111-222-3333', chapter: 'Beta', status: 'Inactive', role: 'member' },
  { id: 'LEM004', name: 'Sarah Davis', email: 'sarah.d@example.com', phone: '444-555-6666', chapter: 'Alpha', status: 'Active', role: 'admin' },
];

const mockCommunicationsLog = [
  { id: 'COMM001', type: 'SMS', subject: 'Event Reminder', recipients: 'John Doe, Jane Smith', status: 'Sent', date: '2024-01-20T10:00:00Z' },
  { id: 'COMM002', type: 'Email', subject: 'Quarterly Dues Notice', recipients: 'All Active Members', status: 'Sent', date: '2024-01-15T09:00:00Z' },
  { id: 'COMM003', type: 'SMS', subject: 'Chapter Meeting Update', recipients: 'Michael Brown', status: 'Failed', date: '2024-01-10T15:30:00Z' },
];

export default function Communications() {
  const [activeTab, setActiveTab] = useState('sms');
  const [smsMessage, setSmsMessage] = useState('');
  const [smsRecipients, setSmsRecipients] = useState([]);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [emailRecipients, setEmailRecipients] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError] = useState('');

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
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSendSuccess(true);
      setSmsMessage('');
      setSmsRecipients([]);
      // Add to mock log
      mockCommunicationsLog.unshift({
        id: `COMM${Date.now()}`,
        type: 'SMS',
        subject: smsMessage.substring(0, 30) + '...',
        recipients: smsRecipients.map(id => mockMembers.find(m => m.id === id)?.name).join(', '),
        status: 'Sent',
        date: new Date().toISOString()
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
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSendSuccess(true);
      setEmailSubject('');
      setEmailBody('');
      setEmailRecipients([]);
      // Add to mock log
      mockCommunicationsLog.unshift({
        id: `COMM${Date.now()}`,
        type: 'Email',
        subject: emailSubject,
        recipients: emailRecipients.map(id => mockMembers.find(m => m.id === id)?.name).join(', '),
        status: 'Sent',
        date: new Date().toISOString()
      });
    } catch (error) {
      setSendError('Failed to send email. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Sent': return 'bg-green-100 text-green-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Communications Dashboard</h1>
            <p className="text-white/90 mt-1">Manage SMS notifications and email campaigns</p>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sms">SMS Notifications</TabsTrigger>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
          <TabsTrigger value="log">Communications Log</TabsTrigger>
        </TabsList>

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
                    onValueChange={(value) => setSmsRecipients(value)}
                    multiple // Enable multiple selection
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="all_active">All Active Members</SelectItem>
                      <SelectItem value="all_inactive">All Inactive Members</SelectItem>
                      <SelectItem value="all_admins">All Admins</SelectItem>
                      {mockMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.chapter})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {smsRecipients.map(id => {
                      const member = mockMembers.find(m => m.id === id);
                      if (member) {
                        return <Badge key={id} variant="secondary">{member.name}</Badge>;
                      } else if (id === 'all_members') {
                        return <Badge key={id} variant="secondary">All Members</Badge>;
                      } else if (id === 'all_active') {
                        return <Badge key={id} variant="secondary">All Active Members</Badge>;
                      } else if (id === 'all_inactive') {
                        return <Badge key={id} variant="secondary">All Inactive Members</Badge>;
                      } else if (id === 'all_admins') {
                        return <Badge key={id} variant="secondary">All Admins</Badge>;
                      }
                      return null;
                    })}
                  </div>
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
                  {/* In a real app, this would be a rich text editor */}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailRecipients">Recipients *</Label>
                  <Select
                    value={emailRecipients}
                    onValueChange={(value) => setEmailRecipients(value)}
                    multiple // Enable multiple selection
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipients" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_members">All Members</SelectItem>
                      <SelectItem value="all_active">All Active Members</SelectItem>
                      <SelectItem value="all_inactive">All Inactive Members</SelectItem>
                      <SelectItem value="all_admins">All Admins</SelectItem>
                      {mockMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.chapter})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {emailRecipients.map(id => {
                      const member = mockMembers.find(m => m.id === id);
                      if (member) {
                        return <Badge key={id} variant="secondary">{member.name}</Badge>;
                      } else if (id === 'all_members') {
                        return <Badge key={id} variant="secondary">All Members</Badge>;
                      } else if (id === 'all_active') {
                        return <Badge key={id} variant="secondary">All Active Members</Badge>;
                      } else if (id === 'all_inactive') {
                        return <Badge key={id} variant="secondary">All Inactive Members</Badge>;
                      } else if (id === 'all_admins') {
                        return <Badge key={id} variant="secondary">All Admins</Badge>;
                      }
                      return null;
                    })}
                  </div>
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

        {/* Communications Log Tab */}
        <TabsContent value="log" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communications Log</CardTitle>
              <CardDescription>View a history of all sent SMS and email communications</CardDescription>
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
                        {comm.type === 'SMS' ? (
                          <Phone className="h-6 w-6 text-purple-600" />
                        ) : (
                          <Mail className="h-6 w-6 text-blue-600" />
                        )}
                        <div>
                          <h3 className="font-semibold">{comm.subject}</h3>
                          <p className="text-sm text-gray-600">To: {comm.recipients}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(comm.date).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}