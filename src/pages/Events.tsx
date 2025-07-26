import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  MapPin, 
  Clock, 
  Users, 
  Info, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Search,
  Filter,
  Download
} from 'lucide-react';

// Mock event data
const mockEvents = [
  {
    id: 'EVT001',
    name: 'Annual Leadership Summit',
    date: '2024-03-15',
    time: '09:00 AM',
    location: 'Grand Hyatt, New York',
    description: 'Keynote speakers, workshops, and networking for chapter leaders.',
    capacity: 200,
    registered: 150,
    status: 'Upcoming',
    category: 'Leadership',
    organizer: 'National Board'
  },
  {
    id: 'EVT002',
    name: 'Community Service Day',
    date: '2024-04-22',
    time: '10:00 AM',
    location: 'Local Food Bank',
    description: 'Volunteer opportunity to support our local community.',
    capacity: 50,
    registered: 45,
    status: 'Upcoming',
    category: 'Service',
    organizer: 'Alpha Chapter'
  },
  {
    id: 'EVT003',
    name: 'New Member Orientation',
    date: '2024-02-10',
    time: '06:00 PM',
    location: 'Chapter House',
    description: 'Welcome new members and introduce them to Lambda Empire values.',
    capacity: 30,
    registered: 28,
    status: 'Past',
    category: 'Recruitment',
    organizer: 'Beta Chapter'
  },
];

export default function Events() {
  const [events, setEvents] = useState(mockEvents);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const eventCategories = ['Leadership', 'Service', 'Recruitment', 'Social', 'Academic'];
  const eventStatuses = ['Upcoming', 'Past', 'Cancelled'];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setIsFormDialogOpen(true);
  };

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setIsFormDialogOpen(true);
  };

  const handleDeleteEvent = (event) => {
    setCurrentEvent(event);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setEvents(events.filter(event => event.id !== currentEvent.id));
    setIsDeleteDialogOpen(false);
    setCurrentEvent(null);
  };

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEvent = {
      id: currentEvent ? currentEvent.id : `EVT${Date.now()}`,
      name: formData.get('name'),
      date: formData.get('date'),
      time: formData.get('time'),
      location: formData.get('location'),
      description: formData.get('description'),
      capacity: parseInt(formData.get('capacity')),
      registered: currentEvent ? currentEvent.registered : 0,
      status: formData.get('status'),
      category: formData.get('category'),
      organizer: currentEvent ? currentEvent.organizer : 'Admin' // Mock organizer
    };

    if (currentEvent) {
      setEvents(events.map(event => event.id === newEvent.id ? newEvent : event));
    } else {
      setEvents([...events, newEvent]);
    }
    setIsFormDialogOpen(false);
    setCurrentEvent(null);
  };

  const exportEvents = () => {
    console.log('Exporting events data...');
    // Implement data export logic
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Calendar className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Event Management</h1>
              <p className="text-white/90 mt-1">Create, manage, and track all Lambda Empire events</p>
            </div>
          </div>
          <Button onClick={handleAddEvent} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Plus className="h-4 w-4 mr-2" />
            Add New Event
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Event Search & Filters</CardTitle>
          <CardDescription>Find and filter events by name, category, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {eventCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {eventStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportEvents} variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event List */}
      <Card>
        <CardHeader>
          <CardTitle>All Events ({filteredEvents.length})</CardTitle>
          <CardDescription>Overview of all upcoming and past events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4" />
                <p>No events found matching your criteria.</p>
              </div>
            ) : (
              filteredEvents.map(event => (
                <div key={event.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.name}</h3>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <MapPin className="h-4 w-4" /> {event.location}
                        <Clock className="h-4 w-4 ml-4" /> {event.time}
                        <Calendar className="h-4 w-4 ml-4" /> {new Date(event.date).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge className={
                      event.status === 'Upcoming' ? 'bg-green-100 text-green-800' :
                      event.status === 'Past' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <p>
                      <Users className="h-4 w-4 inline-block mr-1" /> {event.registered}/{event.capacity} Registered
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(event)}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Event Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {currentEvent ? 'Modify the details of this event.' : 'Fill in the details for a new Lambda Empire event.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name *</Label>
                <Input id="name" name="name" defaultValue={currentEvent?.name || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select name="category" defaultValue={currentEvent?.category || ''} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input id="date" name="date" type="date" defaultValue={currentEvent?.date || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input id="time" name="time" type="time" defaultValue={currentEvent?.time || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" defaultValue={currentEvent?.capacity || ''} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input id="location" name="location" defaultValue={currentEvent?.location || ''} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" defaultValue={currentEvent?.description || ''} className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select name="status" defaultValue={currentEvent?.status || 'Upcoming'} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {eventStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{currentEvent ? 'Save Changes' : 'Add Event'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event "{currentEvent?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}