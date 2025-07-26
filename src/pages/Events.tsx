import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';

export default function Events() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <Calendar className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Events</h1>
            <p className="text-white/90 mt-1">Lambda Empire conferences, meetings, and activities</p>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Register for upcoming Lambda Empire events</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Annual Gala 2025</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    January 15, 2025 • 7:00 PM
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    Grand Ballroom, Marriott Downtown
                  </div>
                </div>
                <Badge className="bg-lambda-gold">Featured</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Join us for our premier annual celebration featuring keynote speakers, awards ceremony, and networking.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="h-4 w-4" />
                  $125 per person
                </div>
                <Button className="bg-lambda-purple hover:bg-lambda-purple/90">
                  Register Now
                </Button>
              </div>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Regional Leadership Summit</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <Calendar className="h-4 w-4" />
                    January 22-24, 2025
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    Atlanta Convention Center
                  </div>
                </div>
                <Badge variant="outline">Multi-day</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Three-day intensive leadership development program for regional coordinators and chapter leaders.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="h-4 w-4" />
                  $350 (includes meals)
                </div>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Chapter Meetings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Monthly Chapter Meeting</p>
                <p className="text-sm text-gray-600">Jan 8, 2025 • 6:30 PM</p>
              </div>
              <Button size="sm">Join</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Executive Board Meeting</p>
                <p className="text-sm text-gray-600">Jan 12, 2025 • 7:00 PM</p>
              </div>
              <Badge variant="secondary">Board Only</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Conferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">National Convention</p>
                <p className="text-sm text-gray-600">July 15-18, 2025</p>
              </div>
              <Badge>Save Date</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Youth Summit</p>
                <p className="text-sm text-gray-600">March 20-22, 2025</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Special Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Scholarship Fundraiser</p>
                <p className="text-sm text-gray-600">Feb 14, 2025</p>
              </div>
              <Button size="sm" className="bg-lambda-gold hover:bg-lambda-gold/90">
                Support
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Community Service Day</p>
                <p className="text-sm text-gray-600">Feb 28, 2025</p>
              </div>
              <Button size="sm" variant="outline">Volunteer</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Registered Events */}
      <Card>
        <CardHeader>
          <CardTitle>My Registered Events</CardTitle>
          <CardDescription>Events you're currently registered for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Annual Gala 2025</p>
                  <p className="text-sm text-gray-600">January 15, 2025 • Confirmed</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Registered</Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Monthly Chapter Meeting</p>
                  <p className="text-sm text-gray-600">January 8, 2025 • Recurring</p>
                </div>
              </div>
              <Badge variant="outline">Recurring</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}