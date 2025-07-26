import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  History, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Filter,
  Download,
  Search,
  Calendar,
  UserCheck,
  UserX,
  UserMinus,
  Settings,
  Eye,
  FileText
} from 'lucide-react';

// Status change log data
const statusChangeLogs = [
  {
    id: 'LOG001',
    memberId: 'LEM001234',
    memberName: 'John Doe',
    previousStatus: 'Active',
    newStatus: 'Inactive',
    changeType: 'automatic',
    reason: 'Service hours requirement not met (8 hours short)',
    requestedBy: 'System',
    requestedById: 'SYSTEM',
    approvedBy: 'Admin Sarah Johnson',
    approvedById: 'LEM001235',
    requestDate: '2024-01-15T10:30:00Z',
    approvalDate: '2024-01-15T14:20:00Z',
    effectiveDate: '2024-01-15T14:20:00Z',
    status: 'approved',
    notes: 'Member notified via email. Grace period of 30 days provided.',
    category: 'compliance'
  },
  {
    id: 'LOG002',
    memberId: 'LEM001236',
    memberName: 'Michael Brown',
    previousStatus: 'Active',
    newStatus: 'Inactive',
    changeType: 'self_requested',
    reason: 'Personal leave - family emergency',
    requestedBy: 'Michael Brown',
    requestedById: 'LEM001236',
    approvedBy: 'Admin Sarah Johnson',
    approvedById: 'LEM001235',
    requestDate: '2024-01-10T09:15:00Z',
    approvalDate: '2024-01-10T11:45:00Z',
    effectiveDate: '2024-01-12T00:00:00Z',
    status: 'approved',
    notes: 'Temporary leave approved. Expected return date: March 2024.',
    category: 'personal'
  },
  {
    id: 'LOG003',
    memberId: 'LEM001237',
    memberName: 'Emily White',
    previousStatus: 'Active',
    newStatus: 'Suspended',
    changeType: 'admin_initiated',
    reason: 'Dues payment overdue by 120 days',
    requestedBy: 'Admin Sarah Johnson',
    requestedById: 'LEM001235',
    approvedBy: 'Super Admin John Smith',
    approvedById: 'LEM001001',
    requestDate: '2024-01-08T16:00:00Z',
    approvalDate: '2024-01-09T08:30:00Z',
    effectiveDate: '2024-01-09T08:30:00Z',
    status: 'approved',
    notes: 'Multiple payment reminders sent. Member unresponsive.',
    category: 'financial'
  },
  {
    id: 'LOG004',
    memberId: 'LEM001238',
    memberName: 'David Wilson',
    previousStatus: 'Active',
    newStatus: 'Non-Member',
    changeType: 'self_requested',
    reason: 'Voluntary resignation - career change',
    requestedBy: 'David Wilson',
    requestedById: 'LEM001238',
    approvedBy: null,
    approvedById: null,
    requestDate: '2024-01-05T14:20:00Z',
    approvalDate: null,
    effectiveDate: null,
    status: 'pending',
    notes: 'Exit interview scheduled. Awaiting final approval.',
    category: 'voluntary'
  },
  {
    id: 'LOG005',
    memberId: 'LEM001239',
    memberName: 'Lisa Garcia',
    previousStatus: 'Inactive',
    newStatus: 'Active',
    changeType: 'self_requested',
    reason: 'Return from personal leave',
    requestedBy: 'Lisa Garcia',
    requestedById: 'LEM001239',
    approvedBy: 'Admin Sarah Johnson',
    approvedById: 'LEM001235',
    requestDate: '2024-01-03T10:00:00Z',
    approvalDate: '2024-01-03T15:30:00Z',
    effectiveDate: '2024-01-04T00:00:00Z',
    status: 'approved',
    notes: 'Reactivation approved. Member completed required training.',
    category: 'reactivation'
  }
];

// Pending status change requests
const pendingRequests = [
  {
    id: 'REQ001',
    memberId: 'LEM001240',
    memberName: 'Robert Taylor',
    currentStatus: 'Active',
    requestedStatus: 'Inactive',
    reason: 'Medical leave - surgery recovery',
    requestDate: '2024-01-20T11:30:00Z',
    expectedDuration: '3 months',
    supportingDocuments: ['medical_certificate.pdf'],
    urgency: 'high',
    category: 'medical'
  },
  {
    id: 'REQ002',
    memberId: 'LEM001241',
    memberName: 'Jennifer Martinez',
    currentStatus: 'Active',
    requestedStatus: 'Non-Member',
    reason: 'Relocation to different state',
    requestDate: '2024-01-19T16:45:00Z',
    expectedDuration: 'Permanent',
    supportingDocuments: [],
    urgency: 'medium',
    category: 'relocation'
  }
];

export default function StatusChangeLog() {
  const [logs, setLogs] = useState(statusChangeLogs);
  const [pendingReqs, setPendingReqs] = useState(pendingRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
    
    // Date range filtering would be implemented here
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChangeTypeIcon = (changeType) => {
    switch (changeType) {
      case 'automatic': return <Settings className="h-4 w-4" />;
      case 'self_requested': return <User className="h-4 w-4" />;
      case 'admin_initiated': return <UserCheck className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusChangeIcon = (previousStatus, newStatus) => {
    if (newStatus === 'Active') return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (newStatus === 'Inactive') return <UserMinus className="h-4 w-4 text-yellow-600" />;
    if (newStatus === 'Suspended') return <XCircle className="h-4 w-4 text-red-600" />;
    if (newStatus === 'Non-Member') return <UserX className="h-4 w-4 text-gray-600" />;
    return <Clock className="h-4 w-4 text-blue-600" />;
  };

  const approveRequest = (request, approved, notes) => {
    const newLog = {
      id: `LOG${Date.now()}`,
      memberId: request.memberId,
      memberName: request.memberName,
      previousStatus: request.currentStatus,
      newStatus: approved ? request.requestedStatus : request.currentStatus,
      changeType: 'self_requested',
      reason: request.reason,
      requestedBy: request.memberName,
      requestedById: request.memberId,
      approvedBy: 'Current Admin',
      approvedById: 'CURRENT_ADMIN',
      requestDate: request.requestDate,
      approvalDate: new Date().toISOString(),
      effectiveDate: approved ? new Date().toISOString() : null,
      status: approved ? 'approved' : 'rejected',
      notes: notes,
      category: request.category
    };

    setLogs(prev => [newLog, ...prev]);
    setPendingReqs(prev => prev.filter(req => req.id !== request.id));
    setIsApprovalDialogOpen(false);
    setApprovalNotes('');
  };

  const exportLogs = () => {
    console.log('Exporting status change logs...');
    // Implementation for exporting logs to CSV/PDF
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <History className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Status Change Log</h1>
              <p className="text-white/90 mt-1">Track all member status changes and approvals</p>
            </div>
          </div>
          <Button onClick={exportLogs} className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            <Download className="h-4 w-4 mr-2" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
            <div className="text-sm text-gray-600">Total Changes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingReqs.length}</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{logs.filter(l => l.status === 'approved').length}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{logs.filter(l => l.status === 'rejected').length}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingReqs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pending Status Change Requests ({pendingReqs.length})
            </CardTitle>
            <CardDescription>
              Review and approve member status change requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReqs.map((request) => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusChangeIcon(request.currentStatus, request.requestedStatus)}
                        <div>
                          <h3 className="font-semibold">{request.memberName}</h3>
                          <p className="text-sm text-gray-600">
                            {request.currentStatus} → {request.requestedStatus}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                        request.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }>
                        {request.urgency} priority
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsApprovalDialogOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    <p><strong>Reason:</strong> {request.reason}</p>
                    <p><strong>Requested:</strong> {new Date(request.requestDate).toLocaleDateString()}</p>
                    {request.expectedDuration && (
                      <p><strong>Duration:</strong> {request.expectedDuration}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Status Changes</CardTitle>
          <CardDescription>Search and filter the status change log</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search member, ID, or reason..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="voluntary">Voluntary</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="reactivation">Reactivation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Change Log */}
      <Card>
        <CardHeader>
          <CardTitle>Status Change History ({filteredLogs.length})</CardTitle>
          <CardDescription>
            Complete history of all member status changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getChangeTypeIcon(log.changeType)}
                      {getStatusChangeIcon(log.previousStatus, log.newStatus)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{log.memberName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {log.memberId}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {log.previousStatus} → {log.newStatus}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {log.reason}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <Badge className={getStatusColor(log.status)}>
                        {log.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(log.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedLog(log);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Requested by:</span> {log.requestedBy}
                  </div>
                  {log.approvedBy && (
                    <div>
                      <span className="font-medium">Approved by:</span> {log.approvedBy}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Category:</span> {log.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Request Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Status Change Request</DialogTitle>
            <DialogDescription>
              Review and approve or reject the status change request
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Member</Label>
                  <p className="text-lg font-semibold">{selectedRequest.memberName}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.memberId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status Change</Label>
                  <div className="flex items-center gap-2">
                    {getStatusChangeIcon(selectedRequest.currentStatus, selectedRequest.requestedStatus)}
                    <span>{selectedRequest.currentStatus} → {selectedRequest.requestedStatus}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Reason</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Request Date</Label>
                  <p className="text-sm">{new Date(selectedRequest.requestDate).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Expected Duration</Label>
                  <p className="text-sm">{selectedRequest.expectedDuration}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Admin Notes</Label>
                <Textarea
                  placeholder="Add notes about this decision..."
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApprovalDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => approveRequest(selectedRequest, false, approvalNotes)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => approveRequest(selectedRequest, true, approvalNotes)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Status Change Details</DialogTitle>
            <DialogDescription>
              Complete information about this status change
            </DialogDescription>
          </DialogHeader>
          
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Member</Label>
                  <p className="text-lg font-semibold">{selectedLog.memberName}</p>
                  <p className="text-sm text-gray-600">{selectedLog.memberId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status Change</Label>
                  <div className="flex items-center gap-2">
                    {getStatusChangeIcon(selectedLog.previousStatus, selectedLog.newStatus)}
                    <span>{selectedLog.previousStatus} → {selectedLog.newStatus}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Reason</Label>
                <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedLog.reason}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Change Type</Label>
                  <div className="flex items-center gap-2">
                    {getChangeTypeIcon(selectedLog.changeType)}
                    <span className="capitalize">{selectedLog.changeType.replace('_', ' ')}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Badge variant="outline" className="capitalize">
                    {selectedLog.category}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Requested By</Label>
                  <p className="text-sm">{selectedLog.requestedBy}</p>
                  <p className="text-xs text-gray-500">{new Date(selectedLog.requestDate).toLocaleString()}</p>
                </div>
                {selectedLog.approvedBy && (
                  <div>
                    <Label className="text-sm font-medium">Approved By</Label>
                    <p className="text-sm">{selectedLog.approvedBy}</p>
                    <p className="text-xs text-gray-500">{new Date(selectedLog.approvalDate).toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              {selectedLog.effectiveDate && (
                <div>
                  <Label className="text-sm font-medium">Effective Date</Label>
                  <p className="text-sm">{new Date(selectedLog.effectiveDate).toLocaleString()}</p>
                </div>
              )}
              
              {selectedLog.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{selectedLog.notes}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Badge className={getStatusColor(selectedLog.status)}>
                  {selectedLog.status}
                </Badge>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}