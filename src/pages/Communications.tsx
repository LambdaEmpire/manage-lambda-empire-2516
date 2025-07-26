import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Users, Bell } from 'lucide-react';

export default function Communications() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <MessageSquare className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Communications</h1>
            <p className="text-white/90 mt-1">Send messages and announcements to members</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Communications Dashboard</CardTitle>
          <CardDescription>Manage all member communications from this central hub</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Communications Center</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This feature will allow administrators to send targeted messages, announcements, and notifications to members based on their level, chapter, or custom groups.
            </p>
            <div className="space-y-3">
              <Button className="bg-lambda-purple hover:bg-lambda-purple/90">
                <Send className="h-4 w-4 mr-2" />
                Compose Message
              </Button>
              <div className="text-sm text-gray-500">
                Coming soon: Email campaigns, SMS notifications, and in-app messaging
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}