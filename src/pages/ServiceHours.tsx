import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Calendar, MapPin, Upload, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ServiceHours() {
  const [isLogHoursDialogOpen, setIsLogHoursDialogOpen] = useState(false);
  const [newHoursEntry, setNewHoursEntry] = useState({
    activity: '',
    date: '',
    hours: '',
    location: '',
    description: '',
    category: '',
    proof: null, // For file upload
  });
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ success: false, error: '' });

  const serviceCategories = [
    'Education & Mentorship', 'Community Service', 'Food & Hunger Relief', 
    'Environmental', 'Healthcare', 'Animal Welfare', 'Other'
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewHoursEntry(prev => ({ ...prev, proof: file }));
      setUploadedFileName(file.name);
    } else {
      setNewHoursEntry(prev => ({ ...prev, proof: null }));
      setUploadedFileName('');
    }
  };

  const handleLogHoursSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ success: false, error: '' });

    if (!newHoursEntry.activity || !newHoursEntry.date || !newHoursEntry.hours || !newHoursEntry.location || !newHoursEntry.category) {
      setSubmitStatus({ success: false, error: 'Please fill in all required fields.' });
      return;
    }

    console.log('Logging service hours:', newHoursEntry);
    // Simulate API call for logging hours and uploading proof
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus({ success: true, error: '' });
      setNewHoursEntry({
        activity: '', date: '', hours: '', location: '', description: '', category: '', proof: null,
      });
      setUploadedFileName('');
      setIsLogHoursDialogOpen(false);
    } catch (error) {
      setSubmitStatus({ success: false, error: 'Failed to log hours. Please try again.' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Clock className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Service Hours</h1>
              <p className="text-white/90 mt-1">Track your community service contributions</p>
            </div>
          </div>
          <Button onClick={() => setIsLogHoursDialogOpen(true)} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Plus className="h-4 w-4 mr-2" />
            Log Hours
          </Button>
        </div>
      </div>

      {/* Service Hours Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Quarter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">24.5</div>
            <p className="text-xs text-muted-foreground">hours logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">89.5</div>
            <p className="text-xs text-muted-foreground">hours total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lifetime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">347</div>
            <p className="text-xs text-muted-foreground">hours served</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">#12</div>
            <p className="text-xs text-muted-foreground">in chapter</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Service Activities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Service Activities</CardTitle>
              <CardDescription>Your latest community service contributions</CardDescription>
            </div>
            <Button onClick={() => setIsLogHoursDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Log New Hours
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Food Bank Volunteer</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    December 15, 2024
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Metro Food Bank
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    4.5 hours
                  </div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Helped sort and distribute food packages to families in need during the holiday season.
            </p>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Youth Mentorship Program</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    December 8, 2024
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Lincoln High School
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    3.0 hours
                  </div>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Approved</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Provided academic tutoring and career guidance to high school students.
            </p>
          </div>

          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">Community Clean-up Day</h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    November 25, 2024
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Riverside Park
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    6.0 hours
                  </div>
                </div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            </div>
            <p className="text-sm text-gray-600">
              Organized and participated in park beautification and litter removal activities.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Categories</CardTitle>
            <CardDescription>Hours breakdown by service type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">Education & Mentorship</span>
              <Badge>32.5 hours</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">Community Service</span>
              <Badge>28.0 hours</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">Food & Hunger Relief</span>
              <Badge>19.5 hours</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">Environmental</span>
              <Badge>9.5 hours</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Opportunities</CardTitle>
            <CardDescription>Join these upcoming service events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Holiday Toy Drive</p>
                <p className="text-sm text-gray-600">Dec 22, 2024 • 4 hours</p>
              </div>
              <Button size="sm">Sign Up</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Senior Center Visit</p>
                <p className="text-sm text-gray-600">Jan 5, 2025 • 3 hours</p>
              </div>
              <Button size="sm" variant="outline">Details</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Habitat for Humanity</p>
                <p className="text-sm text-gray-600">Jan 12, 2025 • 8 hours</p>
              </div>
              <Button size="sm">Sign Up</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log Hours Dialog */}
      <Dialog open={isLogHoursDialogOpen} onOpenChange={setIsLogHoursDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log New Service Hours</DialogTitle>
            <DialogDescription>
              Enter details of your service activity and provide proof.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogHoursSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activity">Activity Name *</Label>
                <Input 
                  id="activity" 
                  value={newHoursEntry.activity} 
                  onChange={(e) => setNewHoursEntry(prev => ({ ...prev, activity: e.target.value }))} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={newHoursEntry.category} 
                  onValueChange={(value) => setNewHoursEntry(prev => ({ ...prev, category: value }))} 
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={newHoursEntry.date} 
                  onChange={(e) => setNewHoursEntry(prev => ({ ...prev, date: e.target.value }))} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours">Hours *</Label>
                <Input 
                  id="hours" 
                  type="number" 
                  step="0.5" 
                  min="0.5" 
                  value={newHoursEntry.hours} 
                  onChange={(e) => setNewHoursEntry(prev => ({ ...prev, hours: parseFloat(e.target.value) }))} 
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input 
                id="location" 
                value={newHoursEntry.location} 
                onChange={(e) => setNewHoursEntry(prev => ({ ...prev, location: e.target.value }))} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newHoursEntry.description} 
                onChange={(e) => setNewHoursEntry(prev => ({ ...prev, description: e.target.value }))} 
                className="min-h-[100px]" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="proof">Proof of Service (Optional)</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="proof" 
                  type="file" 
                  onChange={handleFileChange} 
                  className="flex-1" 
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                {uploadedFileName && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" /> {uploadedFileName}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">Accepted formats: PDF, JPG, PNG</p>
            </div>

            {submitStatus.error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {submitStatus.error}
                </AlertDescription>
              </Alert>
            )}
            {submitStatus.success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Service hours logged successfully!
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsLogHoursDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Log Hours</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}