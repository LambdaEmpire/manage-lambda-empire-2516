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
import { supabase } from '@/lib/supabase';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';

const memberTitlesMap = {
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
  const [viewMode, setViewMode] = useState('grid');
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { toast } = useToast();
  
  // Get current authenticated user
  const { user } = useOptimizedAuth();
  
  // Fetch real member data from Supabase
  const { data: members, loading: membersLoading, error: membersError } = useRealtimeData({
    table: 'profiles',
    select: '*',
    orderBy: { column: 'first_name', ascending: true }
  });
  
  // Get current user profile from the members data
  const currentUserProfile = members?.find(member => member.id === user?.id);
  
  // Check if current user has admin privileges
  const isCurrentUserAdmin = currentUserProfile?.can_approve_members || currentUserProfile?.is_super_admin;
  const isCurrentUserNationalBoard = currentUserProfile?.level === 'National' || currentUserProfile?.title?.includes('national');

  // Get unique values for filters from real data
  const regions = members ? [...new Set(members.map(m => m.region).filter(Boolean))] : [];
  const chapters = members ? [...new Set(members.map(m => m.chapter).filter(Boolean))] : [];

  const filteredMembers = (members || []).filter(member => {
    // If member is invisible, only show to admins/national board
    if (member.invisible && !(isCurrentUserAdmin || isCurrentUserNationalBoard)) {
      return false;
    }

    const fullName = `${member.first_name || ''} ${member.last_name || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (member.member_id && member.member_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (canViewField(member, 'email') && member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLevel = selectedLevel === 'all' || (member.level && member.level.toLowerCase() === selectedLevel);
    const matchesRegion = selectedRegion === 'all' || member.region === selectedRegion;
    const matchesChapter = selectedChapter === 'all' || member.chapter === selectedChapter;
    const matchesOrgAffiliation = selectedOrgAffiliation === 'all' || member.org_affiliation === selectedOrgAffiliation;
    
    return matchesSearch && matchesLevel && matchesRegion && matchesChapter && matchesOrgAffiliation;
  });

  // Check if current user can view a specific field based on privacy settings
  const canViewField = (member, field) => {
    if (member.id === user?.id) return true; // Can always see own info
    
    // Default privacy settings if not specified
    const defaultPrivacy = {
      email: 'members',
      phone: 'private', 
      location: 'members',
      bio: 'public',
      interests: 'public',
      serviceHours: 'members',
      accomplishments: 'public',
      joinDate: 'members'
    };
    
    const privacy = member.privacy?.[field] || defaultPrivacy[field] || 'members';
    if (privacy === 'public') return true;
    if (privacy === 'private') return false;
    if (privacy === 'members') return !member.invisible; // Members only if not invisible
    
    return false;
  };

  const updatePrivacySetting = async (field, value) => {
    if (!currentUserProfile) return;
    
    try {
      const updatedPrivacy = {
        ...currentUserProfile.privacy,
        [field]: value
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ privacy: updatedPrivacy })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Privacy Updated",
        description: `${field} privacy setting has been updated to ${value}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update privacy setting: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  const toggleInvisibleMode = async (invisible) => {
    if (!currentUserProfile) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ invisible })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Visibility Updated",
        description: `You are now ${invisible ? 'invisible' : 'visible'} to other members.`,
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: `Failed to update visibility: ${error.message}`,
        variant: "destructive"
      });
    }
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
          {membersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading member directory...</p>
              </div>
            </div>
          ) : membersError ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">Error loading member directory</p>
              <p className="text-gray-500 text-sm">{membersError}</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No members found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  {/* Member Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-lg">
                        {`${member.first_name?.[0] || ''}${member.last_name?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{`${member.first_name || ''} ${member.last_name || ''}`.trim()}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        {getTitleIcon(member.title || 'member')}
                        <span>{memberTitlesMap[member.title || 'member']}</span>
                      </div>
                      <Badge className={`mt-1 text-xs ${getStatusColor(member.status || 'Active')}`}>
                        {member.status || 'Active'}
                      </Badge>
                      <Badge className="mt-1 text-xs" variant="outline">
                        {member.org_affiliation || 'Lambda Empire'}
                      </Badge>
                    </div>
                  </div>

                  {/* Member Info */}
                  <div className="space-y-3">
                    {/* Contact Information */}
                    <div className="space-y-2">
                      {canViewField(member, 'email') && member.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{member.email}</span>
                        </div>
                      )}
                      {canViewField(member, 'phone') && member.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      {canViewField(member, 'location') && (member.city || member.state) && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{[member.city, member.state].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* Chapter & Region */}
                    <div className="space-y-2">
                      {member.chapter && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span>{member.chapter}</span>
                        </div>
                      )}
                      {member.region && (
                        <div className="flex items-center gap-2 text-sm">
                          <GraduationCap className="h-4 w-4 text-gray-500" />
                          <span>{member.region} Region</span>
                        </div>
                      )}
                      {canViewField(member, 'joinDate') && member.created_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>Joined {new Date(member.created_at).toLocaleDateString()}</span>
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
                    {canViewField(member, 'interests') && member.interests && Array.isArray(member.interests) && member.interests.length > 0 && (
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
                    {canViewField(member, 'serviceHours') && member.service_hours && (
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-600">{member.service_hours} Service Hours</span>
                      </div>
                    )}

                    {/* Accomplishments */}
                    {canViewField(member, 'accomplishments') && member.accomplishments && Array.isArray(member.accomplishments) && member.accomplishments.length > 0 && (
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
                    {member.labels && Array.isArray(member.labels) && member.labels.length > 0 && (
                      <div className="pt-2 border-t">
                        <div className="flex flex-wrap gap-1">
                          {member.labels.map((label, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

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
                        {member.id === user?.id && (
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
          )}
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