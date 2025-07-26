import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Plus, Edit, Trash2, Award, Users } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface AccomplishmentType {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  icon_color: string;
  category: string;
  is_active: boolean;
}

interface Member {
  id: string;
  email: string;
  raw_user_meta_data: any;
}

interface MemberAccomplishment {
  id: string;
  member_id: string;
  accomplishment_type_id: string;
  awarded_by: string;
  awarded_at: string;
  notes: string;
  accomplishment_types: AccomplishmentType;
  member_email: string;
}

const AccomplishmentsManagement = () => {
  const [accomplishmentTypes, setAccomplishmentTypes] = useState<AccomplishmentType[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberAccomplishments, setMemberAccomplishments] = useState<MemberAccomplishment[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAwardDialogOpen, setIsAwardDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<AccomplishmentType | null>(null);
  const { toast } = useToast();

  const [newType, setNewType] = useState({
    name: '',
    description: '',
    icon_name: 'Award',
    icon_color: '#3B82F6',
    category: 'general'
  });

  const [awardForm, setAwardForm] = useState({
    member_id: '',
    accomplishment_type_id: '',
    notes: ''
  });

  const iconOptions = [
    'Award', 'GraduationCap', 'Crown', 'Heart', 'Lightbulb', 'Users', 'UserCheck',
    'Star', 'Trophy', 'Medal', 'Target', 'Zap', 'Shield', 'Gem'
  ];

  const categories = ['general', 'academic', 'leadership', 'service', 'innovation', 'teamwork', 'mentorship'];

  useEffect(() => {
    fetchAccomplishmentTypes();
    fetchMembers();
    fetchMemberAccomplishments();
  }, []);

  const fetchAccomplishmentTypes = async () => {
    const { data, error } = await supabase
      .from('accomplishment_types')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch accomplishment types",
        variant: "destructive"
      });
    } else {
      setAccomplishmentTypes(data || []);
    }
  };

  const fetchMembers = async () => {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive"
      });
    } else {
      setMembers(data.users || []);
    }
  };

  const fetchMemberAccomplishments = async () => {
    const { data, error } = await supabase
      .from('member_accomplishments')
      .select(`
        *,
        accomplishment_types (*)
      `)
      .order('awarded_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch member accomplishments",
        variant: "destructive"
      });
    } else {
      // Get member emails
      const accomplishmentsWithEmails = await Promise.all(
        (data || []).map(async (acc) => {
          const member = members.find(m => m.id === acc.member_id);
          return {
            ...acc,
            member_email: member?.email || 'Unknown'
          };
        })
      );
      setMemberAccomplishments(accomplishmentsWithEmails);
    }
  };

  const handleCreateType = async () => {
    const { error } = await supabase
      .from('accomplishment_types')
      .insert([newType]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create accomplishment type",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Accomplishment type created successfully"
      });
      setIsCreateDialogOpen(false);
      setNewType({
        name: '',
        description: '',
        icon_name: 'Award',
        icon_color: '#3B82F6',
        category: 'general'
      });
      fetchAccomplishmentTypes();
    }
  };

  const handleUpdateType = async () => {
    if (!editingType) return;

    const { error } = await supabase
      .from('accomplishment_types')
      .update({
        name: editingType.name,
        description: editingType.description,
        icon_name: editingType.icon_name,
        icon_color: editingType.icon_color,
        category: editingType.category,
        is_active: editingType.is_active
      })
      .eq('id', editingType.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update accomplishment type",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Accomplishment type updated successfully"
      });
      setEditingType(null);
      fetchAccomplishmentTypes();
    }
  };

  const handleAwardAccomplishment = async () => {
    const { error } = await supabase
      .from('member_accomplishments')
      .insert([{
        member_id: awardForm.member_id,
        accomplishment_type_id: awardForm.accomplishment_type_id,
        notes: awardForm.notes,
        awarded_by: (await supabase.auth.getUser()).data.user?.id
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to award accomplishment",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Accomplishment awarded successfully"
      });
      setIsAwardDialogOpen(false);
      setAwardForm({
        member_id: '',
        accomplishment_type_id: '',
        notes: ''
      });
      fetchMemberAccomplishments();
    }
  };

  const renderIcon = (iconName: string, color: string, size: number = 20) => {
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Award;
    return <IconComponent size={size} style={{ color }} />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Accomplishments Management</h1>
      </div>

      <Tabs defaultValue="types" className="space-y-6">
        <TabsList>
          <TabsTrigger value="types">Accomplishment Types</TabsTrigger>
          <TabsTrigger value="awards">Award Accomplishments</TabsTrigger>
          <TabsTrigger value="history">Award History</TabsTrigger>
        </TabsList>

        <TabsContent value="types" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Accomplishment Types</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Accomplishment Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newType.name}
                      onChange={(e) => setNewType({ ...newType, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newType.description}
                      onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={newType.icon_name} onValueChange={(value) => setNewType({ ...newType, icon_name: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            <div className="flex items-center gap-2">
                              {renderIcon(icon, newType.icon_color)}
                              {icon}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={newType.icon_color}
                      onChange={(e) => setNewType({ ...newType, icon_color: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={newType.category} onValueChange={(value) => setNewType({ ...newType, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleCreateType} className="w-full">
                    Create Type
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accomplishmentTypes.map((type) => (
              <Card key={type.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {renderIcon(type.icon_name, type.icon_color, 24)}
                      <CardTitle className="text-lg">{type.name}</CardTitle>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingType(type)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{type.category}</Badge>
                    <Badge variant={type.is_active ? "default" : "destructive"}>
                      {type.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="awards" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Award Accomplishments</h2>
            <Dialog open={isAwardDialogOpen} onOpenChange={setIsAwardDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Award className="w-4 h-4 mr-2" />
                  Award Accomplishment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Award Accomplishment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="member">Member</Label>
                    <Select value={awardForm.member_id} onValueChange={(value) => setAwardForm({ ...awardForm, member_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a member" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="accomplishment">Accomplishment Type</Label>
                    <Select value={awardForm.accomplishment_type_id} onValueChange={(value) => setAwardForm({ ...awardForm, accomplishment_type_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select accomplishment type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accomplishmentTypes.filter(type => type.is_active).map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              {renderIcon(type.icon_name, type.icon_color)}
                              {type.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={awardForm.notes}
                      onChange={(e) => setAwardForm({ ...awardForm, notes: e.target.value })}
                      placeholder="Add any notes about this accomplishment..."
                    />
                  </div>
                  <Button onClick={handleAwardAccomplishment} className="w-full">
                    Award Accomplishment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <h2 className="text-xl font-semibold">Award History</h2>
          <div className="space-y-4">
            {memberAccomplishments.map((accomplishment) => (
              <Card key={accomplishment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {renderIcon(accomplishment.accomplishment_types.icon_name, accomplishment.accomplishment_types.icon_color, 24)}
                      <div>
                        <h3 className="font-semibold">{accomplishment.accomplishment_types.name}</h3>
                        <p className="text-sm text-gray-600">Awarded to {accomplishment.member_email}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(accomplishment.awarded_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{accomplishment.accomplishment_types.category}</Badge>
                  </div>
                  {accomplishment.notes && (
                    <p className="mt-2 text-sm text-gray-600 italic">"{accomplishment.notes}"</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Type Dialog */}
      {editingType && (
        <Dialog open={!!editingType} onOpenChange={() => setEditingType(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Accomplishment Type</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingType.name}
                  onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingType.description}
                  onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-icon">Icon</Label>
                <Select value={editingType.icon_name} onValueChange={(value) => setEditingType({ ...editingType, icon_name: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>
                        <div className="flex items-center gap-2">
                          {renderIcon(icon, editingType.icon_color)}
                          {icon}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-color">Color</Label>
                <Input
                  id="edit-color"
                  type="color"
                  value={editingType.icon_color}
                  onChange={(e) => setEditingType({ ...editingType, icon_color: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select value={editingType.category} onValueChange={(value) => setEditingType({ ...editingType, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-active"
                  checked={editingType.is_active}
                  onChange={(e) => setEditingType({ ...editingType, is_active: e.target.checked })}
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
              <Button onClick={handleUpdateType} className="w-full">
                Update Type
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AccomplishmentsManagement;