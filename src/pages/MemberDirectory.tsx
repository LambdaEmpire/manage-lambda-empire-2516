import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Settings,
  Shield,
  Crown,
  Star,
  Award,
  MessageSquare,
  UserCheck,
  Building,
  GraduationCap,
  Heart,
  Trophy
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock member data with privacy settings
const members = [
  {
    id: 'LEM001234',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '(555) 123-4567',
    level: 'Chapter',
    title: 'chapter_president',
    chapter: 'Alpha Chapter',
    region: 'Northeast',
    joinDate: '2020-03-15',
    status: 'Active',
    orgAffiliation: 'Lambda Phi Omega Fraternity, Inc.',
    city: 'New York',
    state: 'NY',
    bio: 'Passionate about community service and leadership development. Love hiking and photography.',
    interests: ['Leadership', 'Photography', 'Hiking', 'Community Service'],
    serviceHours: 59,
    accomplishments: ['Leadership Excellence Award', 'Community Service Champion'],
    privacy: {
      email: 'members', // public, members, private
      phone: 'private',
      location: 'members',
      bio: 'public',
      interests: 'public',
      serviceHours: 'members',
      accomplishments: 'public',
      joinDate: 'members'
    },
    labels: ['Leadership Team', 'Volunteer Coordinator'],
    invisible: false // New field for invisibility
  },
  {
    id: 'LEM001235',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '(555) 234-5678',
    level: 'Regional',
    title: 'regional_director',
    chapter: 'Beta Chapter',
    region: 'Southeast',
    joinDate: '2019-08-22',
    status: 'Active',
    orgAffiliation: 'Lambda Xi Eta Sorority, Inc.',
    city: 'Atlanta',
    state: 'GA',
    bio: 'Regional coordinator with a passion for mentoring new members.',
    interests: ['Mentoring', 'Event Planning', 'Public Speaking'],
    serviceHours: 76,
    accomplishments: ['Regional Excellence Award', 'Mentor of the Year'],
    privacy: {
      email: 'members',
      phone: 'members',
      location: 'public',
      bio: 'public',
      interests: 'public',
      serviceHours: 'public',
      accomplishments: 'public',
      joinDate: 'public'
    },
    labels: ['Regional Coordinator', 'Mentor'],
    invisible: false
  },
  {
    id: 'LEM001236',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '(555) 345-6789',
    level: 'National',
    title: 'national_treasurer',
    chapter: 'Gamma Chapter',
    region: 'Midwest',
    joinDate: '2018-01-10',
    status: 'Active',
    orgAffiliation: 'Lambda Phi Omega Fraternity, Inc.',
    city: 'Chicago',
    state: 'IL',
    bio: 'Financial expert dedicated to the fiscal health of Lambda Empire.',
    interests: ['Finance', 'Strategic Planning', 'Technology'],
    serviceHours: 92,
    accomplishments: ['Financial Excellence Award', 'Innovation Leader'],
    privacy: {
      email: 'private',
      phone: 'private',
      location: 'members',
      bio: 'members',
      interests: 'members',
      serviceHours: 'members',
      accomplishments: 'public',
      joinDate: 'members'
    },
    labels: ['Executive Board', 'Financial Officer'],
    invisible: false
  },
  {
    id: 'LEM001237',
    name: 'Emily White',
    email: 'emily.w@email.com',
    phone: '(555) 456-7890',
    level: 'National',
    title: 'national_vp',
    chapter: 'Delta Chapter',
    region: 'West',
    joinDate: '2021-05-01',
    status: 'Active',
    orgAffiliation: 'Lambda Xi Eta Sorority, Inc.',
    city: 'Los Angeles',
    state: 'CA',
    bio: 'National leader focused on expanding our reach and impact.',
    interests: ['Leadership', 'Networking', 'Travel', 'Social Impact'],
    serviceHours: 84,
    accomplishments: ['National Leadership Award', 'Expansion Champion'],
    privacy: {
      email: 'members',
      phone: 'private',
      location: 'public',
      bio: 'public',
      interests: 'public',
      serviceHours: 'public',
      accomplishments: 'public',
      joinDate: 'public'
    },
    labels: ['National Leadership', 'Sorority Liaison'],
    invisible: false
  }
];

const memberTitlesMap = { // Renamed to avoid conflict with memberTitles array
  'national_president': 'National President',
  'national_vp': 'National Vice President',
  'national_secretary': 'National Secretary',
  'national_treasurer': 'National Treasurer',
  'regional_director': 'Regional Director',
  'regional_coordinator': 'Regional Coordinator',
  'chapter_president': 'Chapter President',
  'chapter_vp': 'Chapter Vice President',
  'chapter_secretary': 'Chapter Secretary',
  'chapter_treasurer': 'Chapter Treasurer',
  'member': 'General Member'
};

export default function MemberDirectory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [selectedOrgAffiliation, setSelectedOrgAffiliation] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentUser, setCurrentUser] = useState(members[0]); // Simulate logged-in user
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { toast } = useToast();

  // Simulate admin/national board roles for the current user
  const isCurrentUserAdmin = currentUser.id === 'LEM001236'; // Michael Brown is admin
  const isCurrentUserNationalBoard = currentUser.level === 'National';

  // Get unique values for filters
  const regions = [...new Set(members.map(m => m.region))];
  const chapters = [...new Set(members.map(m => m.chapter))];

  const filteredMembers = members.filter(member => {
    // If member is invisible, only show to admins/national board
    if (member.invisible && !(isCurrentUserAdmin || isCurrentUserNationalBoard)) {
      return false;
    }

    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (canViewField(member, 'email') && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || member.level.toLowerCase() === selectedLevel;
    const matchesRegion = selectedRegion === 'all' || member.region === selectedRegion;
    const matchesChapter = selectedChapter === 'all' || member.chapter === selectedChapter;
    const matchesOrgAffiliation = selectedOrgAffiliation === 'all' || member.orgAffiliation === selectedOrgAffiliation;
    
    return matchesSearch && matchesLevel && matchesRegion && matchesChapter && matchesOrgAffiliation;
  });

  // Check if current user can view a specific field based on privacy settings
  const canViewField = (member, field) => {
    if (member.id === currentUser.id) return true; // Can always see own info
    
    const privacy = member.privacy[field];
    if (privacy === 'public') return true;
    if (privacy === 'private') return false;
    if (privacy === 'members') return !member.invisible; // Members only if not invisible
    
    return false;
  };

  const updatePrivacySetting = (field, value) => {
    // In a real app, this would update the backend
    setCurrentUser(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
    toast({
      title: "Privacy Updated",
      description: `${field} privacy setting has been updated to ${value}.`,
    });
  };

  const toggleInvisibleMode = (invisible) => {
    setCurrentUser(prev => ({
      ...prev,
      invisible: invisible
    }));
    toast({
      title: "Visibility Updated",
      description: `You are now ${invisible ? 'invisible' : 'visible'} to other members.`,
    });
  };

  const sendMessage = (member) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${member.name}`,
    });
  };

  const getTitleIcon = (title) => {
    if (title.includes('national')) return <Crown className="h-4 w-4 text-yellow-600" />;
    if (title.includes('regional')) return <Star className="h-4 w-4 text-blue-600" />;
    if (title.includes('president') || title.includes('vp')) return <Shield className="h-4 w-4 text-purple-600" />;
    return <UserCheck className="h-4 w-4 text-gray-600" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Users className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Lambda Member Directory</h1>
              <p className="text-white/90 mt-1">Connect with fellow Lambda Empire members</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* Go Invisible Toggle */}
            <div className="flex items-center space-x-2">
              <Label htmlFor="invisible-mode" className="text-white">Go Invisible</Label>
              <Switch
                id="invisible-mode"
                checked={currentUser.invisible}
                onCheckedChange={toggleInvisibleMode}
              />
            </div>
            <Button 
              onClick={() => {
                setSelectedMember(currentUser);
                setIsPrivacyDialogOpen(true);
              }}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Settings className="h-4 w-4 mr-2" />
              Privacy Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Find Members</CardTitle>
          <CardDescription>Search and filter the Lambda Empire member directory</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="national">National</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
                <SelectItem value="chapter">Chapter</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by Chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                {chapters.map(chapter => (
                  <SelectItem key={chapter} value={chapter}>{chapter}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedOrgAffiliation} onValueChange={setSelectedOrgAffiliation}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Org Affiliation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Affiliations</SelectItem>
                <SelectItem value="Lambda Xi Eta Sorority, Inc.">Lambda Xi Eta Sorority, Inc.</SelectItem>
                <SelectItem value="Lambda Phi Omega Fraternity, Inc.">Lambda Phi Omega Fraternity, Inc.</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Member Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Directory ({filteredMembers.length} members)</CardTitle>
          <CardDescription>Lambda Empire member profiles with privacy-controlled information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Member Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-lg">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getTitleIcon(member.title)}
                        <span>{memberTitlesMap[member.title]}</span>
                      </div>
                      <Badge className={`mt-1 text-xs ${getStatusColor(member.status)}`}>
                        {member.status}
                      </Badge>
                      <Badge className="mt-1 text-xs" variant="outline">
                        {member.orgAffiliation}
                      </Badge>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      {canViewField(member, 'email') && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {canViewField(member, 'phone') && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {canViewField(member, 'location') && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{member.city}, {member.state}</span>
                        </div>
                      )}
                    </div>

                    {/* Chapter & Region */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-gray-500" />
                        <span>{member.chapter}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="h-4 w-4 text-gray-500" />
                        <span>{member.region} Region</span>
                      </div>
                      {canViewField(member, 'joinDate') && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {canViewField(member, 'bio') && member.bio && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-600 italic">"{member.bio}"</p>
                      </div>
                    )}

                    {/* Interests */}
                    {canViewField(member, 'interests') && member.interests && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Interests</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {member.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Service Hours */}
                    {canViewField(member, 'serviceHours') && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">{member.serviceHours} Service Hours</span>
                      </div>
                    )}

                    {/* Accomplishments */}
                    {canViewField(member, 'accomplishments') && member.accomplishments && (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Accomplishments</span>
                        </div>
                        <div className="space-y-1">
                          {member.accomplishments.map((accomplishment, index) => (
                            <Badge key={index} className="bg-yellow-100 text-yellow-800 text-xs mr-1">
                              {accomplishment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Labels */}
                    <div className="pt-2 border-t">
                      <div className="flex flex-wrap gap-1">
                        {member.labels.map((label, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t">
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => sendMessage(member)}
                          className="flex-1"
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        {member.id === currentUser.id && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedMember(member);
                              setIsPrivacyDialogOpen(true);
                            }}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings Dialog */}
      <Dialog open={isPrivacyDialogOpen} onOpenChange={setIsPrivacyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
            <DialogDescription>
              Control who can see your profile information in the member directory
            </DialogDescription>
          </DialogHeader>
          
          {selectedMember && (
            <div className="space-y-6">
              {/* Privacy Explanation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-2">Privacy Levels</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Public:</strong> Visible to everyone, including non-members</p>
                  <p><strong>Members Only:</strong> Visible only to Lambda Empire members</p>
                  <p><strong>Private:</strong> Hidden from everyone except you</p>
                </div>
              </div>

              {/* Privacy Controls */}
              <div className="space-y-4">
                <h4 className="font-medium">Information Visibility</h4>
                
                {/* Email Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Email Address</p>
                      <p className="text-sm text-gray-600">{selectedMember.email}</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.email} 
                    onValueChange={(value) => updatePrivacySetting('email', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Phone Number</p>
                      <p className="text-sm text-gray-600">{selectedMember.phone}</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.phone} 
                    onValueChange={(value) => updatePrivacySetting('phone', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">{selectedMember.city}, {selectedMember.state}</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.location} 
                    onValueChange={(value) => updatePrivacySetting('location', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Bio</p>
                      <p className="text-sm text-gray-600">Personal description</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.bio} 
                    onValueChange={(value) => updatePrivacySetting('bio', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Interests Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Interests</p>
                      <p className="text-sm text-gray-600">Hobbies and interests</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.interests} 
                    onValueChange={(value) => updatePrivacySetting('interests', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Hours Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Service Hours</p>
                      <p className="text-sm text-gray-600">Community service hours</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.serviceHours} 
                    onValueChange={(value) => updatePrivacySetting('serviceHours', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Accomplishments Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Accomplishments</p>
                      <p className="text-sm text-gray-600">Awards and achievements</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.accomplishments} 
                    onValueChange={(value) => updatePrivacySetting('accomplishments', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Join Date Privacy */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium">Join Date</p>
                      <p className="text-sm text-gray-600">When you joined Lambda Empire</p>
                    </div>
                  </div>
                  <Select 
                    value={selectedMember.privacy.joinDate} 
                    onValueChange={(value) => updatePrivacySetting('joinDate', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsPrivacyDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}