import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { GraduationCap, BookOpen, Video, CheckCircle, Clock, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function LambdaKnowledge() {
  const [canAddKnowledge, setCanAddKnowledge] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const knowledgeCategories = [
    'History',
    'Policies',
    'How-To Guides',
    'Resources',
    'FAQs',
    'Leadership',
    'Community Service',
    'Events',
    'Training Materials'
  ];

  // Check user permissions on component mount
  useEffect(() => {
    checkUserPermissions();
  }, []);

  const checkUserPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user has permission to add knowledge
      const { data: addKnowledgePermission } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('permission_type', 'add_knowledge')
        .maybeSingle();

      // Check if user is admin
      const { data: adminPermission } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('permission_type', 'admin')
        .maybeSingle();

      setCanAddKnowledge(!!addKnowledgePermission || !!adminPermission);
      setLoading(false);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setLoading(false);
    }
  };

  const handleAddKnowledge = () => {
    if (!canAddKnowledge) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add knowledge articles.",
        variant: "destructive"
      });
      return;
    }
    
    setIsFormDialogOpen(true);
  };

  const handleSubmitKnowledge = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const knowledgeData = {
        title: formData.get('title'),
        content: formData.get('content'),
        category: formData.get('category'),
        tags: formData.get('tags')?.split(',').map(tag => tag.trim()).filter(tag => tag !== '') || [],
        difficulty_level: formData.get('difficulty_level'),
        estimated_time: formData.get('estimated_time'),
        is_required: formData.get('is_required') === 'true'
      };

      // Here you would typically save to your knowledge base table
      // For now, we'll just show a success message
      console.log('Knowledge article data:', knowledgeData);

      toast({
        title: "Knowledge Article Created",
        description: `"${knowledgeData.title}" has been successfully added to the knowledge base.`,
      });

      setIsFormDialogOpen(false);
      // Reset form would happen automatically when dialog closes
    } catch (error) {
      console.error('Error creating knowledge article:', error);
      toast({
        title: "Error",
        description: "Failed to create knowledge article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GraduationCap className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Lambda Knowledge</h1>
              <p className="text-white/90 mt-1">Online Learning Management System</p>
            </div>
          </div>
          {canAddKnowledge && (
            <Button 
              onClick={handleAddKnowledge} 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
          )}
        </div>
      </div>

      {/* Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Progress</CardTitle>
          <CardDescription>Track your completion of required learning modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">85% Complete</span>
            </div>
            <Progress value={85} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">12</div>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">2</div>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">1</div>
                <p className="text-sm text-gray-600">Not Started</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Required Learning Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Required Learning Modules</CardTitle>
          <CardDescription>Complete these modules to maintain active membership status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Leadership Fundamentals</h3>
                    <p className="text-sm text-gray-600">Core leadership principles and practices</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="h-4 w-4" />
                4 videos • 2 hours
              </div>
              <Progress value={100} className="h-1" />
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Ethics in Leadership</h3>
                    <p className="text-sm text-gray-600">Ethical decision-making framework</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                3 readings • 5 videos • 3 hours
              </div>
              <Progress value={60} className="h-1" />
              <Button size="sm" className="w-full">Continue Learning</Button>
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-semibold">Lambda Empire History</h3>
                    <p className="text-sm text-gray-600">Our organization's founding and evolution</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Completed</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="h-4 w-4" />
                6 readings • 1.5 hours
              </div>
              <Progress value={100} className="h-1" />
            </div>

            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                  <div>
                    <h3 className="font-semibold">Community Engagement</h3>
                    <p className="text-sm text-gray-600">Effective community service strategies</p>
                  </div>
                </div>
                <Badge variant="outline">Not Started</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Video className="h-4 w-4" />
                2 videos • 4 readings • 2.5 hours
              </div>
              <Progress value={0} className="h-1" />
              <Button size="sm" variant="outline" className="w-full">Start Module</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Optional Learning</CardTitle>
            <CardDescription>Enhance your skills with additional content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="font-medium">Advanced Public Speaking</p>
                  <p className="text-sm text-gray-600">6 modules • 4 hours</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Explore</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="h-4 w-4 text-green-600" />
                <div>
                  <p className="font-medium">Financial Management</p>
                  <p className="text-sm text-gray-600">8 readings • 2 hours</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Explore</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="font-medium">Conflict Resolution</p>
                  <p className="text-sm text-gray-600">4 modules • 3 hours</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Explore</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest learning achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Completed Leadership Fundamentals</p>
                <p className="text-sm text-gray-600">December 12, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Started Ethics in Leadership</p>
                <p className="text-sm text-gray-600">December 10, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">Earned Leadership Certificate</p>
                <p className="text-sm text-gray-600">December 8, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Knowledge Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Knowledge Article</DialogTitle>
            <DialogDescription>
              Create a new knowledge article for the Lambda Empire learning system.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitKnowledge} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., How to Conduct Effective Meetings"
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {knowledgeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Article Content *</Label>
              <Textarea 
                id="content" 
                name="content" 
                placeholder="Write the main content of your knowledge article here..."
                className="min-h-[200px]" 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty_level">Difficulty Level</Label>
                <Select name="difficulty_level">
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_time">Estimated Reading Time</Label>
                <Input 
                  id="estimated_time" 
                  name="estimated_time" 
                  placeholder="e.g., 15 minutes"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input 
                id="tags" 
                name="tags" 
                placeholder="e.g., leadership, meetings, communication"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_required">Article Type</Label>
              <Select name="is_required">
                <SelectTrigger>
                  <SelectValue placeholder="Select article type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">Optional Learning</SelectItem>
                  <SelectItem value="true">Required Learning</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsFormDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}