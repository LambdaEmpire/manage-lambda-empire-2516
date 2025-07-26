import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Target, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Plus,
  Edit,
  Eye,
  Share2,
  Gift,
  Heart,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  ExternalLink
} from 'lucide-react';

// Mock fundraising campaigns data
const campaigns = [
  {
    id: 'CAMP001',
    title: 'Lambda Empire Scholarship Fund',
    description: 'Supporting educational opportunities for underprivileged students in our community.',
    goal: 50000,
    raised: 32500,
    donors: 127,
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'active',
    category: 'education',
    image: '/api/placeholder/400/200',
    organizer: 'National Board',
    featured: true,
    rewards: [
      { amount: 25, reward: 'Thank you email and digital certificate' },
      { amount: 100, reward: 'Lambda Empire sticker pack' },
      { amount: 250, reward: 'Official Lambda Empire t-shirt' },
      { amount: 500, reward: 'Invitation to exclusive donor appreciation event' }
    ]
  },
  {
    id: 'CAMP002',
    title: 'Community Service Equipment Fund',
    description: 'Purchasing equipment and supplies for our community service initiatives.',
    goal: 15000,
    raised: 8750,
    donors: 45,
    startDate: '2024-02-01',
    endDate: '2024-04-30',
    status: 'active',
    category: 'community',
    image: '/api/placeholder/400/200',
    organizer: 'Alpha Chapter',
    featured: false,
    rewards: [
      { amount: 50, reward: 'Recognition on chapter website' },
      { amount: 150, reward: 'Lambda Empire water bottle' },
      { amount: 300, reward: 'Volunteer appreciation dinner invitation' }
    ]
  },
  {
    id: 'CAMP003',
    title: 'Annual Convention Sponsorship',
    description: 'Help sponsor our annual national convention and networking event.',
    goal: 25000,
    raised: 25000,
    donors: 89,
    startDate: '2023-11-01',
    endDate: '2024-01-31',
    status: 'completed',
    category: 'events',
    image: '/api/placeholder/400/200',
    organizer: 'National Board',
    featured: false,
    rewards: [
      { amount: 100, reward: 'Convention program recognition' },
      { amount: 500, reward: 'VIP reception invitation' },
      { amount: 1000, reward: 'Sponsor booth at convention' }
    ]
  }
];

const donationHistory = [
  {
    id: 'DON001',
    campaignId: 'CAMP001',
    campaignTitle: 'Lambda Empire Scholarship Fund',
    amount: 100,
    date: '2024-01-15T10:30:00Z',
    anonymous: false,
    message: 'Happy to support education in our community!'
  },
  {
    id: 'DON002',
    campaignId: 'CAMP002',
    campaignTitle: 'Community Service Equipment Fund',
    amount: 50,
    date: '2024-01-10T14:20:00Z',
    anonymous: true,
    message: ''
  }
];

export default function Fundraising() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [isCreateCampaignDialogOpen, setIsCreateCampaignDialogOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [newCampaign, setNewCampaign] = useState({
    title: '',
    description: '',
    goal: '',
    endDate: '',
    category: '',
    rewards: []
  });

  // Mock user role (in real app, this would come from auth context)
  const userRole = 'admin'; // or 'member'

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'education': return <Award className="h-4 w-4" />;
      case 'community': return <Users className="h-4 w-4" />;
      case 'events': return <Calendar className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const calculateProgress = (raised, goal) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const handleDonate = (campaign) => {
    setSelectedCampaign(campaign);
    setDonationAmount('');
    setDonationMessage('');
    setIsAnonymous(false);
    setIsDonationDialogOpen(true);
  };

  const processDonation = async () => {
    console.log('Processing donation:', {
      campaignId: selectedCampaign.id,
      amount: parseFloat(donationAmount),
      message: donationMessage,
      anonymous: isAnonymous
    });
    
    // Simulate donation processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsDonationDialogOpen(false);
    // In real app, would update campaign data and show success message
  };

  const createCampaign = async () => {
    console.log('Creating campaign:', newCampaign);
    
    // Simulate campaign creation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsCreateCampaignDialogOpen(false);
    setNewCampaign({
      title: '',
      description: '',
      goal: '',
      endDate: '',
      category: '',
      rewards: []
    });
    // In real app, would add to campaigns list and show success message
  };

  const shareCampaign = (campaign) => {
    const shareUrl = `${window.location.origin}/fundraising/${campaign.id}`;
    navigator.clipboard.writeText(shareUrl);
    // Show toast notification
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Target className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Fundraising Campaigns</h1>
              <p className="text-white/90 mt-1">Support Lambda Empire initiatives and make a difference</p>
            </div>
          </div>
          {userRole === 'admin' && (
            <Button
              onClick={() => setIsCreateCampaignDialogOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          )}
        </div>
      </div>

      {/* Campaign Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${campaigns.reduce((sum, c) => sum + c.raised, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Raised</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {campaigns.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Active Campaigns</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {campaigns.reduce((sum, c) => sum + c.donors, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Donors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {campaigns.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Campaigns</TabsTrigger>
          <TabsTrigger value="my-donations">My Donations</TabsTrigger>
          {userRole === 'admin' && <TabsTrigger value="manage">Manage Campaigns</TabsTrigger>}
        </TabsList>

        {/* Browse Campaigns Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Featured Campaign */}
          {campaigns.filter(c => c.featured).map(campaign => (
            <Card key={campaign.id} className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className="bg-purple-100 text-purple-800">Featured Campaign</Badge>
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{campaign.title}</CardTitle>
                <CardDescription className="text-lg">{campaign.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{Math.round(calculateProgress(campaign.raised, campaign.goal))}%</span>
                      </div>
                      <Progress value={calculateProgress(campaign.raised, campaign.goal)} className="h-3" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          ${campaign.raised.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Raised</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          ${campaign.goal.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Goal</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {campaign.donors}
                        </div>
                        <div className="text-sm text-gray-600">Donors</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button
                      onClick={() => handleDonate(campaign)}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      disabled={campaign.status !== 'active'}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Donate Now
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => shareCampaign(campaign)}
                      className="w-full"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Campaign
                    </Button>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">Donor Rewards</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {campaign.rewards.map((reward, index) => (
                      <div key={index} className="text-sm bg-white p-2 rounded border">
                        <span className="font-medium">${reward.amount}+:</span> {reward.reward}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Other Campaigns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.filter(c => !c.featured).map(campaign => (
              <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(campaign.category)}
                      <Badge variant="outline" className="capitalize">
                        {campaign.category}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardTitle>{campaign.title}</CardTitle>
                  <CardDescription>{campaign.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(calculateProgress(campaign.raised, campaign.goal))}%</span>
                    </div>
                    <Progress value={calculateProgress(campaign.raised, campaign.goal)} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                      <div className="font-bold text-green-600">
                        ${campaign.raised.toLocaleString()}
                      </div>
                      <div className="text-gray-600">Raised</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-600">
                        ${campaign.goal.toLocaleString()}
                      </div>
                      <div className="text-gray-600">Goal</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-600">
                        {campaign.donors}
                      </div>
                      <div className="text-gray-600">Donors</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDonate(campaign)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                      disabled={campaign.status !== 'active'}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Donate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareCampaign(campaign)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Ends {new Date(campaign.endDate).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Donations Tab */}
        <TabsContent value="my-donations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Donation History</CardTitle>
              <CardDescription>
                Track your contributions to Lambda Empire campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donationHistory.map(donation => (
                  <div key={donation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{donation.campaignTitle}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(donation.date).toLocaleDateString()}
                        </p>
                        {donation.message && (
                          <p className="text-sm text-gray-500 mt-1 italic">
                            "{donation.message}"
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          ${donation.amount}
                        </div>
                        {donation.anonymous && (
                          <Badge variant="outline" className="text-xs">
                            Anonymous
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Campaigns Tab (Admin Only) */}
        {userRole === 'admin' && (
          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Management</CardTitle>
                <CardDescription>
                  Create, edit, and monitor fundraising campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map(campaign => (
                    <div key={campaign.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{campaign.title}</h3>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status}
                            </Badge>
                            {campaign.featured && (
                              <Badge className="bg-purple-100 text-purple-800">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Raised:</span>
                              <span className="font-medium ml-1">
                                ${campaign.raised.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Goal:</span>
                              <span className="font-medium ml-1">
                                ${campaign.goal.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Donors:</span>
                              <span className="font-medium ml-1">{campaign.donors}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Ends:</span>
                              <span className="font-medium ml-1">
                                {new Date(campaign.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analytics
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Donation Dialog */}
      <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Make a Donation
            </DialogTitle>
            <DialogDescription>
              Support: {selectedCampaign?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">Campaign Progress</div>
                <Progress value={calculateProgress(selectedCampaign.raised, selectedCampaign.goal)} className="h-2 mb-2" />
                <div className="flex justify-between text-sm">
                  <span>${selectedCampaign.raised.toLocaleString()} raised</span>
                  <span>${selectedCampaign.goal.toLocaleString()} goal</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Donation Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="0.00"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Leave a message of support..."
                  value={donationMessage}
                  onChange={(e) => setDonationMessage(e.target.value)}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Make this donation anonymous
                </Label>
              </div>

              {selectedCampaign.rewards && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Donor Rewards</h4>
                  <div className="space-y-1">
                    {selectedCampaign.rewards
                      .filter(reward => parseFloat(donationAmount) >= reward.amount)
                      .map((reward, index) => (
                        <div key={index} className="text-xs text-blue-700">
                          • {reward.reward}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDonationDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={processDonation}
              disabled={!donationAmount || parseFloat(donationAmount) < 1}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Heart className="h-4 w-4 mr-2" />
              Donate ${donationAmount || '0'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog (Admin Only) */}
      {userRole === 'admin' && (
        <Dialog open={isCreateCampaignDialogOpen} onOpenChange={setIsCreateCampaignDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Campaign
              </DialogTitle>
              <DialogDescription>
                Set up a new fundraising campaign for Lambda Empire
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Campaign Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter campaign title"
                    value={newCampaign.title}
                    onChange={(e) => setNewCampaign(prev => ({...prev, title: e.target.value}))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newCampaign.category} onValueChange={(value) => setNewCampaign(prev => ({...prev, category: value}))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="community">Community Service</SelectItem>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="emergency">Emergency Relief</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your campaign and its impact..."
                  value={newCampaign.description}
                  onChange={(e) => setNewCampaign(prev => ({...prev, description: e.target.value}))}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal">Fundraising Goal *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="goal"
                      type="number"
                      placeholder="0"
                      value={newCampaign.goal}
                      onChange={(e) => setNewCampaign(prev => ({...prev, goal: e.target.value}))}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign(prev => ({...prev, endDate: e.target.value}))}
                  />
                </div>
              </div>

              <Alert>
                <Gift className="h-4 w-4" />
                <AlertDescription>
                  <strong>Pro Tip:</strong> Campaigns with clear goals, compelling descriptions, and donor rewards typically raise 40% more funds.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateCampaignDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={createCampaign}
                disabled={!newCampaign.title || !newCampaign.description || !newCampaign.goal || !newCampaign.endDate || !newCampaign.category}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}