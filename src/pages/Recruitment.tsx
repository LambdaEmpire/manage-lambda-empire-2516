import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserPlus, Users, FileText, CheckCircle } from 'lucide-react';

export default function Recruitment() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <UserPlus className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Recruitment</h1>
            <p className="text-white/90 mt-1">Manage recruitment processes for new members and pledges</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recruitment Management</CardTitle>
          <CardDescription>Handle applications and onboarding for potential new members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <UserPlus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recruitment Center</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              This comprehensive recruitment system will manage applications, track pledge progress, handle interviews, and streamline the onboarding process for new Lambda Empire members.
            </p>
            <div className="space-y-3">
              <Button className="bg-lambda-purple hover:bg-lambda-purple/90">
                <FileText className="h-4 w-4 mr-2" />
                Review Applications
              </Button>
              <div className="text-sm text-gray-500">
                Coming soon: Application forms, interview scheduling, and pledge tracking
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}