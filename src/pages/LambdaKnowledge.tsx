import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Tag, 
  Info, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Mock knowledge article data
const mockArticles = [
  {
    id: 'ART001',
    title: 'History of Lambda Empire',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'History',
    tags: ['history', 'founding', 'values'],
    author: 'Admin',
    lastUpdated: '2024-01-10'
  },
  {
    id: 'ART002',
    title: 'Member Code of Conduct',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: 'Policies',
    tags: ['conduct', 'rules', 'ethics'],
    author: 'Admin',
    lastUpdated: '2024-01-15'
  },
  {
    id: 'ART003',
    title: 'How to Log Service Hours',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    category: 'How-To Guides',
    tags: ['service', 'hours', 'guide'],
    author: 'Admin',
    lastUpdated: '2024-01-20'
  },
];

export default function LambdaKnowledge() {
  const [articles, setArticles] = useState(mockArticles);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [canAddKnowledge, setCanAddKnowledge] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const articleCategories = ['History', 'Policies', 'How-To Guides', 'Resources', 'FAQs'];
  const allTags = Array.from(new Set(mockArticles.flatMap(article => article.tags)));

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
        .single();

      // Check if user is admin
      const { data: adminPermission } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .eq('permission_type', 'admin')
        .single();

      setCanAddKnowledge(!!addKnowledgePermission || !!adminPermission);
      setIsAdmin(!!adminPermission);
      setLoading(false);
    } catch (error) {
      console.error('Error checking permissions:', error);
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    const matchesTag = filterTag === 'all' || article.tags.includes(filterTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const handleAddArticle = () => {
    if (!canAddKnowledge) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add knowledge articles.",
        variant: "destructive"
      });
      return;
    }
    setCurrentArticle(null);
    setIsFormDialogOpen(true);
  };

  const handleEditArticle = (article) => {
    if (!canAddKnowledge) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit knowledge articles.",
        variant: "destructive"
      });
      return;
    }
    setCurrentArticle(article);
    setIsFormDialogOpen(true);
  };

  const handleDeleteArticle = (article) => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can delete knowledge articles.",
        variant: "destructive"
      });
      return;
    }
    setCurrentArticle(article);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setArticles(articles.filter(article => article.id !== currentArticle.id));
    setIsDeleteDialogOpen(false);
    setCurrentArticle(null);
    toast({
      title: "Article Deleted",
      description: "The knowledge article has been successfully deleted."
    });
  };

  const handleSubmitArticle = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newArticle = {
      id: currentArticle ? currentArticle.id : `ART${Date.now()}`,
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
      tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      author: currentArticle ? currentArticle.author : 'Current User', // In real app, get from auth
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (currentArticle) {
      setArticles(articles.map(article => article.id === newArticle.id ? newArticle : article));
      toast({
        title: "Article Updated",
        description: "The knowledge article has been successfully updated."
      });
    } else {
      setArticles([...articles, newArticle]);
      toast({
        title: "Article Added",
        description: "The new knowledge article has been successfully added."
      });
    }
    setIsFormDialogOpen(false);
    setCurrentArticle(null);
  };

  const exportArticles = () => {
    console.log('Exporting knowledge articles data...');
    toast({
      title: "Export Started",
      description: "Knowledge articles are being exported..."
    });
    // Implement data export logic
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BookOpen className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Lambda Knowledge Management</h1>
              <p className="text-white/90 mt-1">Manage and organize knowledge base articles for members</p>
            </div>
          </div>
          {canAddKnowledge && (
            <Button onClick={handleAddArticle} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="h-4 w-4 mr-2" />
              Add Knowledge
            </Button>
          )}
        </div>
      </div>

      {/* Permission Notice */}
      {!canAddKnowledge && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You are viewing the Lambda Knowledge base in read-only mode. Contact an administrator if you need permission to add or edit articles.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Article Search & Filters</CardTitle>
          <CardDescription>Find and filter knowledge articles by title, category, or tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search articles..."
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
                {articleCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportArticles} variant="outline" className="w-full md:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Article List */}
      <Card>
        <CardHeader>
          <CardTitle>All Articles ({filteredArticles.length})</CardTitle>
          <CardDescription>Overview of all knowledge base articles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4" />
                <p>No articles found matching your criteria.</p>
              </div>
            ) : (
              filteredArticles.map(article => (
                <div key={article.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{article.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                        <Tag className="h-4 w-4" /> {article.category}
                        <Info className="h-4 w-4 ml-4" /> Last Updated: {new Date(article.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canAddKnowledge && (
                        <Button size="sm" variant="outline" onClick={() => handleEditArticle(article)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      {isAdmin && (
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteArticle(article)}>
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {article.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Article Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentArticle ? 'Edit Article' : 'Add New Knowledge Article'}</DialogTitle>
            <DialogDescription>
              {currentArticle ? 'Modify the details of this knowledge article.' : 'Fill in the details for a new Lambda Knowledge article.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitArticle} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title *</Label>
              <Input id="title" name="title" defaultValue={currentArticle?.title || ''} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select name="category" defaultValue={currentArticle?.category || ''} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {articleCategories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" name="content" defaultValue={currentArticle?.content || ''} className="min-h-[200px]" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" defaultValue={currentArticle?.tags.join(', ') || ''} placeholder="e.g., policy, guide, history" />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFormDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{currentArticle ? 'Save Changes' : 'Add Knowledge'}</Button>
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
              Are you sure you want to delete the article "{currentArticle?.title}"? This action cannot be undone.
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