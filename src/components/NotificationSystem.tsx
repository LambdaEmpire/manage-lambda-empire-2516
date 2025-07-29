import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  Mail, 
  Smartphone, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Info,
  MessageSquare,
  Calendar,
  DollarSign,
  Users,
  Award,
  Clock
} from 'lucide-react';

// Mock notification preferences
const defaultPreferences = {
  email: {
    enabled: true,
    events: true,
    payments: true,
    announcements: true,
    statusChanges: true,
    accomplishments: true,
    fundraising: true,
    serviceHours: true
  },
  push: {
    enabled: false,
    events: true,
    payments: true,
    announcements: true,
    statusChanges: true,
    accomplishments: true,
    fundraising: false,
    serviceHours: false
  }
};

// Mock recent notifications
const mockNotifications = [
  {
    id: 'NOT001',
    type: 'announcement',
    title: 'New Chapter Meeting Scheduled',
    message: 'Alpha Chapter meeting scheduled for next Friday at 7 PM.',
    timestamp: '2024-01-20T10:00:00Z',
    read: false,
    priority: 'high',
    category: 'events'
  },
  {
    id: 'NOT002',
    type: 'payment',
    title: 'Quarterly Dues Payment Received',
    message: 'Your Q1 2024 dues payment of $150 has been processed successfully.',
    timestamp: '2024-01-19T14:30:00Z',
    read: true,
    priority: 'medium',
    category: 'payments'
  },
  {
    id: 'NOT003',
    type: 'accomplishment',
    title: 'New Achievement Unlocked',
    message: 'Congratulations! You have earned the "Community Service Champion" badge.',
    timestamp: '2024-01-18T16:45:00Z',
    read: false,
    priority: 'medium',
    category: 'accomplishments'
  },
  {
    id: 'NOT004',
    type: 'status',
    title: 'Status Change Request Approved',
    message: 'Your request to change status to Active has been approved by administration.',
    timestamp: '2024-01-17T09:15:00Z',
    read: true,
    priority: 'high',
    category: 'statusChanges'
  }
];

export default function NotificationSystem() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState('default');
  const [activeTab, setActiveTab] = useState('notifications');

  useEffect(() => {
    // Check if push notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
    }
  }, []);

  const requestPushPermission = async () => {
    if (!pushSupported) return;

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission === 'granted') {
        setPreferences(prev => ({
          ...prev,
          push: { ...prev.push, enabled: true }
        }));
        
        // Show test notification
        new Notification('Lambda Empire Notifications Enabled', {
          body: 'You will now receive push notifications for important updates.',
          icon: '/favicon.ico'
        });
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
    }
  };

  const updateEmailPreference = (category, enabled) => {
    setPreferences(prev => ({
      ...prev,
      email: { ...prev.email, [category]: enabled }
    }));
  };

  const updatePushPreference = (category, enabled) => {
    setPreferences(prev => ({
      ...prev,
      push: { ...prev.push, [category]: enabled }
    }));
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement': return <MessageSquare className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'accomplishment': return <Award className="h-4 w-4" />;
      case 'status': return <Users className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <Bell className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Notification Center</h1>
            <p className="text-white/90 mt-1">Manage your alerts and communication preferences</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white ml-auto">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Notification Settings</TabsTrigger>
        </TabsList>

        {/* Recent Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Notifications</CardTitle>
                  <CardDescription>Stay updated with Lambda Empire activities</CardDescription>
                </div>
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="outline" size="sm">
                    Mark All Read
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications yet.</p>
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-blue-200 shadow-sm'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${getPriorityColor(notification.priority)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Notifications
              </CardTitle>
              <CardDescription>
                Receive updates via your personal email address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-enabled" className="font-medium">
                    Enable Email Notifications
                  </Label>
                  <p className="text-sm text-gray-600">
                    Master switch for all email notifications
                  </p>
                </div>
                <Switch
                  id="email-enabled"
                  checked={preferences.email.enabled}
                  onCheckedChange={(enabled) => 
                    setPreferences(prev => ({
                      ...prev,
                      email: { ...prev.email, enabled }
                    }))
                  }
                />
              </div>

              {preferences.email.enabled && (
                <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                  {[
                    { key: 'announcements', label: 'Organization Announcements', desc: 'Important updates from Lambda Empire leadership' },
                    { key: 'events', label: 'Event Notifications', desc: 'Meeting reminders and event updates' },
                    { key: 'payments', label: 'Payment Confirmations', desc: 'Dues payments and financial transactions' },
                    { key: 'statusChanges', label: 'Status Changes', desc: 'Membership status updates and approvals' },
                    { key: 'accomplishments', label: 'Achievement Notifications', desc: 'New badges and accomplishment recognition' },
                    { key: 'fundraising', label: 'Fundraising Updates', desc: 'Campaign progress and donation confirmations' },
                    { key: 'serviceHours', label: 'Service Hour Reminders', desc: 'Service hour logging and requirements' }
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <Label htmlFor={`email-${item.key}`} className="font-medium">
                          {item.label}
                        </Label>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <Switch
                        id={`email-${item.key}`}
                        checked={preferences.email[item.key]}
                        onCheckedChange={(enabled) => updateEmailPreference(item.key, enabled)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription>
                Instant alerts on your device for urgent updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!pushSupported ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Push notifications are not supported in your current browser.
                  </AlertDescription>
                </Alert>
              ) : pushPermission === 'denied' ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Push notifications are blocked. Please enable them in your browser settings.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-enabled" className="font-medium">
                        Enable Push Notifications
                      </Label>
                      <p className="text-sm text-gray-600">
                        Receive instant alerts for important updates
                      </p>
                    </div>
                    {pushPermission === 'default' ? (
                      <Button onClick={requestPushPermission} size="sm">
                        Enable Push
                      </Button>
                    ) : (
                      <Switch
                        id="push-enabled"
                        checked={preferences.push.enabled}
                        onCheckedChange={(enabled) => 
                          setPreferences(prev => ({
                            ...prev,
                            push: { ...prev.push, enabled }
                          }))
                        }
                      />
                    )}
                  </div>

                  {preferences.push.enabled && pushPermission === 'granted' && (
                    <div className="space-y-3 pl-4 border-l-2 border-green-200">
                      {[
                        { key: 'announcements', label: 'Urgent Announcements', desc: 'Critical organization updates' },
                        { key: 'events', label: 'Event Reminders', desc: 'Meeting starts and important deadlines' },
                        { key: 'payments', label: 'Payment Alerts', desc: 'Due date reminders and confirmations' },
                        { key: 'statusChanges', label: 'Status Updates', desc: 'Immediate status change notifications' },
                        { key: 'accomplishments', label: 'Achievement Alerts', desc: 'New badge and accomplishment notifications' }
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between">
                          <div>
                            <Label htmlFor={`push-${item.key}`} className="font-medium">
                              {item.label}
                            </Label>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                          <Switch
                            id={`push-${item.key}`}
                            checked={preferences.push[item.key]}
                            onCheckedChange={(enabled) => updatePushPreference(item.key, enabled)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Save Preferences */}
          <div className="flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}