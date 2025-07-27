import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Ticket, Plus, Clock, DollarSign } from 'lucide-react';

export default function Events() {
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    capacity: '',
    category: 'meeting'
  });

  const createEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      alert('Please fill in all required fields.');
      return;
    }
    
    console.log('Creating event:', newEvent);
    // In a real app, this would send data to backend
    
    setIsCreateEventDialogOpen(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      price: '',
      capacity: '',
      category: 'meeting'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Events</h1>
              <p className="text-white/90 mt-1">Lambda Empire conferences, meetings, and activities</p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateEventDialogOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
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

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Create a new Lambda Empire event for members to register
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="eventTitle">Event Title *</Label>
              <Input
                id="eventTitle"
                placeholder="e.g., Monthly Chapter Meeting"
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eventDescription">Description</Label>
              <Textarea
                id="eventDescription"
                placeholder="Describe the event, agenda, and what members can expect..."
                value={newEvent.description}
                onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventDate">Date *</Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventTime">Time</Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventLocation">Location *</Label>
              <Input
                id="eventLocation"
                placeholder="e.g., Community Center, 123 Main St"
                value={newEvent.location}
                onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventPrice">Price (optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="eventPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, price: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eventCapacity">Capacity (optional)</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="eventCapacity"
                    type="number"
                    min="1"
                    placeholder="Unlimited"
                    value={newEvent.capacity}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, capacity: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}