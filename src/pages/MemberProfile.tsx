import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import MemberAccomplishments from '../components/MemberAccomplishments';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  bio?: string;
  location?: string;
  city?: string; // New field
  state?: string; // New field
  joined_date?: string;
  avatar_url?: string;
  can_approve_members?: boolean; // New field
}

const MemberProfile = () => {
  const { memberId } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    getCurrentUser();
    if (memberId) {
      fetchProfile();
    }
  }, [memberId]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const fetchProfile = async () => {
    try {
      // First try to get from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', memberId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Get user data from auth
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(memberId!);
      
      if (userError) {
        console.error('Error fetching user:', userError);
        toast({
          title: "Error",
          description: "Failed to fetch member profile",
          variant: "destructive"
        });
        return;
      }

      // Combine profile and user data
      const combinedProfile: UserProfile = {
        id: userData.user.id,
        email: userData.user.email || '',
        first_name: profileData?.first_name || userData.user.user_metadata?.first_name || '',
        last_name: profileData?.last_name || userData.user.user_metadata?.last_name || '',
        phone: profileData?.phone || userData.user.user_metadata?.phone || '',
        bio: profileData?.bio || '',
        location: profileData?.location || '',
        city: profileData?.city || '', // New field
        state: profileData?.state || '', // New field
        joined_date: userData.user.created_at,
        avatar_url: profileData?.avatar_url || userData.user.user_metadata?.avatar_url || '',
        can_approve_members: profileData?.can_approve_members || false // New field
      };

      setProfile(combinedProfile);
      setEditForm(combinedProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch member profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    try {
      // Update or insert profile data
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: profile.id,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          bio: editForm.bio,
          location: editForm.location,
          city: editForm.city, // New field
          state: editForm.state, // New field
          avatar_url: editForm.avatar_url,
          can_approve_members: editForm.can_approve_members // New field
        });

      if (error) {
        throw error;
      }

      setProfile({ ...profile, ...editForm });
      setEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  const isOwnProfile = currentUser?.id === memberId;

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-6">
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Member profile not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                  {profile.first_name} {profile.last_name}
                </h1>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {(profile.location || profile.city || profile.state) && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {profile.location}
                      {profile.location && (profile.city || profile.state) && ', '}
                      {profile.city}{profile.city && profile.state && ', '}{profile.state}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profile.joined_date!).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex space-x-2">
                {editing ? (
                  <>
                    <Button onClick={handleSaveProfile} size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button 
                      onClick={() => {
                        setEditing(false);
                        setEditForm(profile);
                      }} 
                      variant="outline" 
                      size="sm"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setEditing(true)} variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={editForm.first_name || ''}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={editForm.last_name || ''}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editForm.location || ''}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={editForm.city || ''}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={editForm.state || ''}
                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      rows={4}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
              ) : (
                <div>
                  {profile.bio ? (
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  ) : (
                    <p className="text-gray-500 italic">No bio available</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accomplishments Section */}
          <MemberAccomplishments memberId={profile.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <Badge variant="secondary">
                  {new Date(profile.joined_date!).getFullYear()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Compact Accomplishments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Accomplishments</CardTitle>
            </CardHeader>
            <CardContent>
              <MemberAccomplishments memberId={profile.id} showTitle={false} compact={true} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;