import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Ticket, Plus, Clock, DollarSign } from 'lucide-react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const { user } = useOptimizedAuth();

  // Fetch real events data from Supabase
  const { data: events, loading: eventsLoading, error: eventsError } = useRealtimeData({
    table: 'events',
    select: '*',
    orderBy: { column: 'event_date', ascending: true }
  });

  const createEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('events')
        .insert([{
          title: newEvent.title,
          description: newEvent.description,
          event_date: newEvent.date,
          event_time: newEvent.time,
          location: newEvent.location,
          price: newEvent.price ? parseFloat(newEvent.price) : null,
          capacity: newEvent.capacity ? parseInt(newEvent.capacity) : null,
          category: newEvent.category,
          created_by: user?.id
        }]);

      if (error) throw error;

      toast({
        title: "Event Created",
        description: `${newEvent.title} has been created successfully.`,
      });
      
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
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create event: ${error.message}`,
        variant: "destructive"
      });
    }
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
          {eventsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading events...</p>
              </div>
            </div>
          ) : eventsError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">Error loading events</p>
              <p className="text-gray-500 text-sm">{eventsError}</p>
            </div>
          ) : !events || events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-2">No upcoming events scheduled.</p>
              <p className="text-gray-400 text-sm">Check back later for new events or create one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {events.map((event) => (
                <div key={event.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.event_date).toLocaleDateString()}
                        {event.event_time && ` • ${event.event_time}`}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    <Badge variant={event.category === 'gala' ? 'default' : 'outline'}>
                      {event.category}
                    </Badge>
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-600">
                      {event.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    {event.price ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Ticket className="h-4 w-4" />
                        ${event.price} per person
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Ticket className="h-4 w-4" />
                        Free Event
                      </div>
                    )}
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Register
                    </Button>
                  </div>
                  {event.capacity && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Users className="h-3 w-3" />
                      Capacity: {event.capacity} attendees
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Event Categories */}
      {events && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Meetings */}
          {events.filter(e => e.category === 'meeting').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Meetings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.filter(e => e.category === 'meeting').slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.event_date).toLocaleDateString()}
                        {event.event_time && ` • ${event.event_time}`}
                      </p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Conferences */}
          {events.filter(e => e.category === 'conference').length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Conferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.filter(e => e.category === 'conference').slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Details</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Special Events */}
          {events.filter(e => ['gala', 'fundraiser', 'social'].includes(e.category)).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Special Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.filter(e => ['gala', 'fundraiser', 'social'].includes(e.category)).slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      {event.category === 'fundraiser' ? 'Support' : 'Register'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

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