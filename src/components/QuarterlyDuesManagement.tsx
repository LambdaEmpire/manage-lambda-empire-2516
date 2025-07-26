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
  DollarSign, 
  Calendar, 
  Users, 
  Plus, 
  Edit, 
  CheckCircle, 
  XCircle,
  Bell,
  Download,
  RefreshCw,
  Eye
} from 'lucide-react';

// Mock data for dues periods and member dues
const duesPeriods = [
  { id: 'Q1_2024', name: 'Q1 2024', startDate: '2024-01-01', endDate: '2024-03-31', status: 'active', defaultAmount: 50 },
  { id: 'Q4_2023', name: 'Q4 2023', startDate: '2023-10-01', endDate: '2023-12-31', status: 'closed', defaultAmount: 50 },
];

const memberDues = [
  {
    memberId: 'LEM001234',
    memberName: 'John Doe',
    chapter: 'Alpha Chapter',
    dues: [
      { periodId: 'Q1_2024', amountDue: 50, amountPaid: 0, status: 'outstanding', dueDate: '2024-03-31' },
      { periodId: 'Q4_2023', amountDue: 50, amountPaid: 50, status: 'paid', dueDate: '2023-12-31' },
    ]
  },
  {
    memberId: 'LEM001235',
    memberName: 'Sarah Johnson',
    chapter: 'Beta Chapter',
    dues: [
      { periodId: 'Q1_2024', amountDue: 50, amountPaid: 0, status: 'outstanding', dueDate: '2024-03-31' },
      { periodId: 'Q4_2023', amountDue: 50, amountPaid: 0, status: 'overdue', dueDate: '2023-12-31' },
    ]
  },
  {
    memberId: 'LEM001236',
    memberName: 'Michael Brown',
    chapter: 'Gamma Chapter',
    dues: [
      { periodId: 'Q1_2024', amountDue: 50, amountPaid: 50, status: 'paid', dueDate: '2024-03-31' },
      { periodId: 'Q4_2023', amountDue: 50, amountPaid: 50, status: 'paid', dueDate: '2023-12-31' },
    ]
  }
];

export default function QuarterlyDuesManagement() {
  const [periods, setPeriods] = useState(duesPeriods);
  const [membersDues, setMembersDues] = useState(memberDues);
  const [isCreatePeriodDialogOpen, setIsCreatePeriodDialogOpen] = useState(false);
  const [isManageMemberDuesDialogOpen, setIsManageMemberDuesDialogOpen] = useState(false);
  const [newPeriod, setNewPeriod] = useState({ name: '', startDate: '', endDate: '', defaultAmount: '' });
  const [selectedMemberDues, setSelectedMemberDues] = useState(null);
  const [selectedPeriodForMemberDues, setSelectedPeriodForMemberDues] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'outstanding': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const createDuesPeriod = () => {
    if (!newPeriod.name || !newPeriod.startDate || !newPeriod.endDate || !newPeriod.defaultAmount) {
      alert('Please fill all required fields.');
      return;
    }
    const newId = `Q${periods.length + 1}_${new Date(newPeriod.startDate).getFullYear()}`;
    const periodToAdd = {
      id: newId,
      name: newPeriod.name,
      startDate: newPeriod.startDate,
      endDate: newPeriod.endDate,
      status: 'active',
      defaultAmount: parseFloat(newPeriod.defaultAmount)
    };
    setPeriods(prev => [...prev, periodToAdd]);

    // Automatically assign dues to all members for the new period
    setMembersDues(prevMembersDues => prevMembersDues.map(member => ({
      ...member,
      dues: [...member.dues, {
        periodId: newId,
        amountDue: periodToAdd.defaultAmount,
        amountPaid: 0,
        status: 'outstanding',
        dueDate: periodToAdd.endDate
      }]
    })));

    setIsCreatePeriodDialogOpen(false);
    setNewPeriod({ name: '', startDate: '', endDate: '', defaultAmount: '' });
    // In a real app, this would send data to backend
  };

  const updateMemberDues = (memberId, periodId, field, value) => {
    setMembersDues(prevMembersDues => prevMembersDues.map(member => {
      if (member.memberId === memberId) {
        return {
          ...member,
          dues: member.dues.map(duesEntry => {
            if (duesEntry.periodId === periodId) {
              const updatedDues = { ...duesEntry, [field]: value };
              // Update status based on amountPaid
              if (field === 'amountPaid') {
                if (parseFloat(value) >= updatedDues.amountDue) {
                  updatedDues.status = 'paid';
                } else if (new Date() > new Date(updatedDues.dueDate) && parseFloat(value) < updatedDues.amountDue) {
                  updatedDues.status = 'overdue';
                } else {
                  updatedDues.status = 'outstanding';
                }
              }
              return updatedDues;
            }
            return duesEntry;
          })
        };
      }
      return member;
    }));
  };

  const openManageMemberDues = (member) => {
    setSelectedMemberDues(member);
    setIsManageMemberDuesDialogOpen(true);
  };

  const exportDuesData = () => {
    console.log('Exporting dues data...');
    // Implement data export logic
  };

  const sendDuesReminders = () => {
    console.log('Sending dues reminders to outstanding members...');
    // Implement reminder logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DollarSign className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Quarterly Dues Management</h1>
              <p className="text-white/90 mt-1">Manage and track member financial contributions</p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreatePeriodDialogOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Dues Period
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              ${membersDues.reduce((sum, member) => sum + member.dues.filter(d => d.status === 'paid').reduce((s, d) => s + d.amountPaid, 0), 0).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Paid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {membersDues.filter(member => member.dues.some(d => d.status === 'outstanding')).length}
            </div>
            <div className="text-sm text-gray-600">Outstanding Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {membersDues.filter(member => member.dues.some(d => d.status === 'overdue')).length}
            </div>
            <div className="text-sm text-gray-600">Overdue Members</div>
          </CardContent>
        </Card>
      </div>

      {/* Dues Periods */}
      <Card>
        <CardHeader>
          <CardTitle>Dues Periods</CardTitle>
          <CardDescription>Manage active and past quarterly dues periods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {periods.map(period => (
              <div key={period.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{period.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500">Default Amount: ${period.defaultAmount.toFixed(2)}</p>
                </div>
                <Badge className={getStatusColor(period.status)}>
                  {period.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Dues Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Member Dues Overview</CardTitle>
          <CardDescription>Track individual member dues status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {membersDues.map(member => (
              <div key={member.memberId} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{member.memberName}</h3>
                    <p className="text-sm text-gray-600">{member.chapter}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openManageMemberDues(member)}>
                    <Eye className="h-3 w-3 mr-1" />
                    Manage Dues
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {member.dues.map(duesEntry => (
                    <div key={duesEntry.periodId} className="text-center">
                      <p className="font-semibold">{periods.find(p => p.id === duesEntry.periodId)?.name}</p>
                      <p className="text-xs text-gray-500">Due: ${duesEntry.amountDue.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Paid: ${duesEntry.amountPaid.toFixed(2)}</p>
                      <Badge className={getStatusColor(duesEntry.status)}>{duesEntry.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Dues Actions</CardTitle>
          <CardDescription>Perform bulk actions and export data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={sendDuesReminders} className="bg-blue-600 hover:bg-blue-700">
              <Bell className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
            <Button onClick={exportDuesData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Dues Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Dues Period Dialog */}
      <Dialog open={isCreatePeriodDialogOpen} onOpenChange={setIsCreatePeriodDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Dues Period</DialogTitle>
            <DialogDescription>
              Set up a new quarterly dues period and default amount
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="periodName">Period Name *</Label>
              <Input
                id="periodName"
                placeholder="e.g., Q1 2024"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newPeriod.startDate}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newPeriod.endDate}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultAmount">Default Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="defaultAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="50.00"
                  value={newPeriod.defaultAmount}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, defaultAmount: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePeriodDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={createDuesPeriod}>
              <Plus className="h-4 w-4 mr-2" />
              Create Period
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Member Dues Dialog */}
      <Dialog open={isManageMemberDuesDialogOpen} onOpenChange={setIsManageMemberDuesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Dues for {selectedMemberDues?.memberName}</DialogTitle>
            <DialogDescription>
              Adjust individual dues amounts and update payment status
            </DialogDescription>
          </DialogHeader>
          
          {selectedMemberDues && (
            <div className="space-y-4">
              {selectedMemberDues.dues.map(duesEntry => (
                <div key={duesEntry.periodId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{periods.find(p => p.id === duesEntry.periodId)?.name}</h3>
                    <Badge className={getStatusColor(duesEntry.status)}>{duesEntry.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${duesEntry.periodId}-amountDue`}>Amount Due</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id={`${duesEntry.periodId}-amountDue`}
                          type="number"
                          step="0.01"
                          value={duesEntry.amountDue}
                          onChange={(e) => updateMemberDues(selectedMemberDues.memberId, duesEntry.periodId, 'amountDue', parseFloat(e.target.value))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${duesEntry.periodId}-amountPaid`}>Amount Paid</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id={`${duesEntry.periodId}-amountPaid`}
                          type="number"
                          step="0.01"
                          value={duesEntry.amountPaid}
                          onChange={(e) => updateMemberDues(selectedMemberDues.memberId, duesEntry.periodId, 'amountPaid', parseFloat(e.target.value))}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Label htmlFor={`${duesEntry.periodId}-dueDate`}>Due Date</Label>
                    <Input
                      id={`${duesEntry.periodId}-dueDate`}
                      type="date"
                      value={duesEntry.dueDate}
                      onChange={(e) => updateMemberDues(selectedMemberDues.memberId, duesEntry.periodId, 'dueDate', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManageMemberDuesDialogOpen(false)}>
              Close
            </Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}