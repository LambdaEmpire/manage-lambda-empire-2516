import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Award, 
  Star, 
  Plus, 
  Edit, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  BarChart2,
  Settings,
  RefreshCw,
  Download,
  Eye
} from 'lucide-react';

// Mock data for activities and points
const activityTypes = [
  { id: 'event_attendance', name: 'Event Attendance', defaultPoints: 5, category: 'engagement' },
  { id: 'service_hours', name: 'Service Hours', defaultPoints: 1, unit: 'per hour', category: 'service' },
  { id: 'recruitment', name: 'Recruitment', defaultPoints: 10, category: 'growth' },
  { id: 'committee_work', name: 'Committee Work', defaultPoints: 8, category: 'leadership' },
  { id: 'fundraising', name: 'Fundraising', defaultPoints: 2, unit: 'per $10 raised', category: 'financial' },
  { id: 'academic_achievement', name: 'Academic Achievement', defaultPoints: 15, category: 'academic' },
];

// Mock member data with points
const membersWithPoints = [
  {
    id: 'LEM001234',
    name: 'John Doe',
    totalPoints: 120,
    lastQuarterPoints: 45,
    rank: 3,
    activities: [
      { type: 'event_attendance', date: '2024-01-10', points: 5, notes: 'Attended Chapter Meeting' },
      { type: 'service_hours', date: '2024-01-15', points: 10, notes: '10 hours at Food Bank' },
      { type: 'recruitment', date: '2024-02-01', points: 10, notes: 'Recruited new member Sarah' },
    ]
  },
  {
    id: 'LEM001235',
    name: 'Sarah Johnson',
    totalPoints: 150,
    lastQuarterPoints: 60,
    rank: 1,
    activities: [
      { type: 'event_attendance', date: '2024-01-10', points: 5, notes: 'Attended Chapter Meeting' },
      { type: 'committee_work', date: '2024-01-20', points: 8, notes: 'Led Fundraising Committee' },
      { type: 'fundraising', date: '2024-02-10', points: 20, notes: '$100 raised for scholarship' },
    ]
  },
  {
    id: 'LEM001236',
    name: 'Michael Brown',
    totalPoints: 90,
    lastQuarterPoints: 30,
    rank: 5,
    activities: [
      { type: 'service_hours', date: '2024-01-05', points: 5, notes: '5 hours at local park cleanup' },
      { type: 'academic_achievement', date: '2024-02-15', points: 15, notes: 'Dean\'s List' },
    ]
  }
];

export default function MemberPointSystem() {
  const [members, setMembers] = useState(membersWithPoints);
  const [activityRules, setActivityRules] = useState(activityTypes.map(a => ({ ...a, points: a.defaultPoints })));
  const [isLogActivityDialogOpen, setIsLogActivityDialogOpen] = useState(false);
  const [isRulesDialogOpen, setIsRulesDialogOpen] = useState(false);
  const [selectedMemberForLog, setSelectedMemberForLog] = useState(null);
  const [newActivity, setNewActivity] = useState({
    memberId: '',
    type: '',
    points: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'engagement': return 'bg-blue-100 text-blue-800';
      case 'service': return 'bg-green-100 text-green-800';
      case 'growth': return 'bg-purple-100 text-purple-800';
      case 'leadership': return 'bg-yellow-100 text-yellow-800';
      case 'financial': return 'bg-orange-100 text-orange-800';
      case 'academic': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogActivity = (member) => {
    setSelectedMemberForLog(member);
    setNewActivity(prev => ({ ...prev, memberId: member.id, type: '', points: '', notes: '' }));
    setIsLogActivityDialogOpen(true);
  };

  const submitActivity = () => {
    if (!newActivity.memberId || !newActivity.type || !newActivity.points || !newActivity.date) {
      alert('Please fill all required fields.');
      return;
    }

    const activityToAdd = {
      type: newActivity.type,
      date: newActivity.date,
      points: parseInt(newActivity.points),
      notes: newActivity.notes
    };

    setMembers(prevMembers => prevMembers.map(member => {
      if (member.id === newActivity.memberId) {
        return {
          ...member,
          totalPoints: member.totalPoints + activityToAdd.points,
          activities: [...member.activities, activityToAdd]
        };
      }
      return member;
    }));

    setIsLogActivityDialogOpen(false);
    // In a real app, this would send data to backend
  };

  const updateRule = (id, field, value) => {
    setActivityRules(prevRules => prevRules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const exportPointsData = () => {
    console.log('Exporting points data...');
    // Implement data export logic
  };

  const resetQuarterlyPoints = () => {
    if (window.confirm('Are you sure you want to reset all members\' quarterly points? This action cannot be undone.')) {
      setMembers(prevMembers => prevMembers.map(member => ({
        ...member,
        lastQuarterPoints: 0 // In a real app, you might move current points to lastQuarterPoints and then reset current
      })));
      console.log('Quarterly points reset.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Star className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Member Point System</h1>
              <p className="text-white/90 mt-1">Track and reward member engagement and contributions</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsRulesDialogOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Rules
            </Button>
            <Button
              onClick={exportPointsData}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{members.length}</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {members.reduce((sum, m) => sum + m.totalPoints, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Points Earned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activityRules.length}
            </div>
            <div className="text-sm text-gray-600">Activity Rules</div>
          </CardContent>
        </Card>
      </div>

      {/* Member Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Member Leaderboard</CardTitle>
          <CardDescription>Top members by total points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.sort((a, b) => b.totalPoints - a.totalPoints).map((member, index) => (
              <div key={member.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold text-gray-700 w-8 text-center">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-600">ID: {member.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{member.totalPoints} pts</p>
                    <p className="text-xs text-gray-500">Last Q: {member.lastQuarterPoints} pts</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleLogActivity(member)}>
                    <Plus className="h-3 w-3 mr-1" />
                    Log Activity
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Rules Management Dialog */}
      <Dialog open={isRulesDialogOpen} onOpenChange={setIsRulesDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Activity Rules</DialogTitle>
            <DialogDescription>
              Define points awarded for different member activities
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {activityRules.map(rule => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getCategoryColor(rule.category)}>{rule.category}</Badge>
                    <h3 className="font-semibold">{rule.name}</h3>
                  </div>
                  <Button size="sm" variant="outline">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${rule.id}-points`}>Points</Label>
                    <Input
                      id={`${rule.id}-points`}
                      type="number"
                      value={rule.points}
                      onChange={(e) => updateRule(rule.id, 'points', parseInt(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input value={rule.unit || 'N/A'} readOnly className="bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRulesDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={resetQuarterlyPoints} className="bg-red-600 hover:bg-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Quarterly Points
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Activity Dialog */}
      <Dialog open={isLogActivityDialogOpen} onOpenChange={setIsLogActivityDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Log Activity for {selectedMemberForLog?.name}</DialogTitle>
            <DialogDescription>
              Record a new activity and award points to the member
            </DialogDescription>
          </DialogHeader>
          
          {selectedMemberForLog && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="activityType">Activity Type *</Label>
                <Select value={newActivity.type} onValueChange={(value) => {
                  const selectedRule = activityRules.find(rule => rule.id === value);
                  setNewActivity(prev => ({
                    ...prev,
                    type: value,
                    points: selectedRule ? selectedRule.points.toString() : ''
                  }));
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityRules.map(rule => (
                      <SelectItem key={rule.id} value={rule.id}>
                        {rule.name} ({rule.points} {rule.unit || 'points'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pointsAwarded">Points Awarded *</Label>
                <Input
                  id="pointsAwarded"
                  type="number"
                  value={newActivity.points}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, points: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityDate">Date *</Label>
                <Input
                  id="activityDate"
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any relevant notes about this activity..."
                  value={newActivity.notes}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogActivityDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitActivity}>
              <Plus className="h-4 w-4 mr-2" />
              Log Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}