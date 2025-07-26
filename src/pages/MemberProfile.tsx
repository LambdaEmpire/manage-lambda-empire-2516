import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Edit } from 'lucide-react';

export default function MemberProfile() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-lambda-purple to-lambda-gold p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/20">
              <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">John Doe</h1>
              <p className="text-white/90 mt-1">Member ID: LEM001234</p>
            </div>
          </div>
          <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>John Michael Doe</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>john.doe@email.com</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>(555) 123-4567</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>New York, NY</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Join Date</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>March 15, 2020</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Member Level</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Badge className="bg-lambda-purple">Chapter Member</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Member Status */}
        <Card>
          <CardHeader>
            <CardTitle>Member Status</CardTitle>
            <CardDescription>Current standing and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">Active</div>
              <p className="text-sm text-gray-600">Good Standing</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dues Status</span>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Learning Progress</span>
                <Badge className="bg-blue-100 text-blue-800">85%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Service Hours</span>
                <Badge className="bg-orange-100 text-orange-800">24.5h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Labels */}
      <Card>
        <CardHeader>
          <CardTitle>Member Labels</CardTitle>
          <CardDescription>Custom labels assigned by administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Leadership Team
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Volunteer Coordinator
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              Mentor
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Event Organizer
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your dues payment record</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium">Q4 2024 Dues</p>
                <p className="text-sm text-gray-600">Paid on December 15, 2024</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">$150.00</div>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium">Q3 2024 Dues</p>
                <p className="text-sm text-gray-600">Paid on September 10, 2024</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">$150.00</div>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-medium">Q2 2024 Dues</p>
                <p className="text-sm text-gray-600">Paid on June 5, 2024</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">$150.00</div>
                <Badge className="bg-green-100 text-green-800">Paid</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}