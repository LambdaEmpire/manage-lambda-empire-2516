import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  User, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  Send,
  Eye,
  MessageSquare,
  Calendar,
  UserCheck,
  UserX,
  UserMinus,
  Shield
} from 'lucide-react';

// Mock data for status change requests
const mockStatusRequests = [
  {
    id: 'REQ001',
    memberId: 'LEM001',
    memberName: 'John Doe',
    currentStatus: 'Inactive',
    requestedStatus: 'Active',
    reason: 'I have completed all required training and am ready to resume active participation in Lambda Empire activities.',
    submittedDate: '2024-01-20T10:00:00Z',
    status: 'pending',
    reviewedBy: null,
    reviewedDate: null,
    adminNotes: ''
  },
  {
    id: 'REQ002',
    memberId: 'LEM002',
    memberName: 'Jane Smith',
    currentStatus: 'Active',
    requestedStatus: 'Inactive',
    reason: 'Due to work commitments, I need to temporarily step back from active participation.',
    submittedDate: '2024-01-18T14:30:00Z',
    status: 'approved',
    reviewedBy: 'Admin Sarah Davis',
    reviewedDate: '2024-01-19T09:15:00Z',
    adminNotes: 'Approved temporary inactive status. Member can reactivate when ready.'
  },
  {
    id: 'REQ003',
    memberId: 'LEM003',
    memberName: 'Michael Brown',
    currentStatus: 'Suspended',
    requestedStatus: 'Active',
    reason: 'I have addressed the issues that led to my suspension and completed the required remedial actions.',
    submittedDate: '2024-01-15T16:45:00Z',
    status: 'rejected',
    reviewedBy: 'Admin Sarah Davis',
    reviewedDate: '2024-01-17T11:30:00Z',
    adminNotes: 'Additional requirements must be completed before reinstatement. Please contact administration.'
  }
];

// Status definitions with descriptions and requirements
const statusDefinitions = {
  'Active': {
    description: 'Full participation in all Lambda Empire activities and benefits',
    requirements: ['Current dues payment', 'Completed orientation', 'Good standing'],
    icon: <UserCheck className="h-4 w-4" />,
    color: 'bg-green-100 text-green-800'
  },
  'Inactive': {
    description: 'Temporary non-participation while maintaining membership',
    requirements: ['Valid reason for inactivity', 'Intent to return'],
    icon: <UserMinus className="h-4 w-4" />,
    color: 'bg-yellow-100 text-yellow-800'
  },
  'Suspended': {
    description: 'Temporary restriction due to disciplinary action',
    requirements: ['Administrative review', 'Completion of remedial actions'],
    icon: <UserX className="h-4 w-4" />,
    color: 'bg-red-100 text-red-800'
  },
  'Non-member': {
    description: 'No longer a member of Lambda Empire',
    requirements: ['Formal resignation or termination process'],
    icon: <User className="h-4 w-4" />,
    color: 'bg-gray-100 text-gray-800'
  }
};

export default function MemberStatusRequest() {
  const [requests, setRequests] = useState(mockStatusRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [newRequest, setNewRequest] = useState({
    requestedStatus: '',
    reason: ''
  });

  // Mock user data
  const currentUser = {
    id: 'LEM001',
    name: 'John Doe',
    currentStatus: 'Inactive',
    role: 'member' // or 'admin'
  };

  const handleReviewRequest = (request) => {
    setSelectedRequest(request);
    setReviewDecision('');
    setAdminNotes('');
    setIsReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!reviewDecision) return;

    console.log('Submitting review:', {
      requestId: selectedRequest.id,
      decision: reviewDecision,
      notes: adminNotes
    });

    // Update the request status
    setRequests(prev => prev.map(req => 
      req.id === selectedRequest.id 
        ? {
            ...req,
            status: reviewDecision,
            reviewedBy: 'Current Admin',
            reviewedDate: new Date().toISOString(),
            adminNotes: adminNotes
          }
        : req
    ));

    setIsReviewDialogOpen(false);
    setSelectedRequest(null);
  };

  const submitStatusRequest = async () => {
    if (!newRequest.requestedStatus || !newRequest.reason.trim()) return;

    const request = {
      id: `REQ${Date.now()}`,
      memberId: currentUser.id,
      memberName: currentUser.name,
      currentStatus: currentUser.currentStatus,
      requestedStatus: newRequest.requestedStatus,
      reason: newRequest.reason,
      submittedDate: new Date().toISOString(),
      status: 'pending',
      reviewedBy: null,
      reviewedDate: null,
      adminNotes: ''
    };

    setRequests(prev => [request, ...prev]);
    setNewRequest({ requestedStatus: '', reason: '' });
    setIsSubmitDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const canRequestStatus = (targetStatus) => {
    const current = currentUser.currentStatus;
    
    // Define allowed transitions
    const allowedTransitions = {
      'Active': ['Inactive'],
      'Inactive': ['Active'],
      'Suspended': ['Active'], // Requires admin approval
      'Non-member': [] // Cannot request status changes
    };

    return allowedTransitions[current]?.includes(targetStatus) || false;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Member Status Requests</h1>
              <p className="text-white/90 mt-1">Manage membership status changes and approvals</p>
            </div>
          </div>
          {currentUser.role === 'member' && (
            <Button
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Send className="h-4 w-4 mr-2" />
              Request Status Change
            </Button>
          )}
        </div>
      </div>

      {/* Status Definitions */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Status Definitions</CardTitle>
          <CardDescription>
            Understanding the different membership status levels and their requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(statusDefinitions).map(([status, definition]) => (
              <div key={status} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={definition.color}>
                    {definition.icon}
                    {status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{definition.description}</p>
                <div>
                  <h4 className="text-sm font-medium mb-1">Requirements:</h4>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {definition.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Status Change Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Status Change Requests</CardTitle>
          <CardDescription>
            {currentUser.role === 'admin' 
              ? 'Review and approve member status change requests'
              : 'Track your status change requests and their approval status'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No status change requests found.</p>
              </div>
            ) : (
              requests.map(request => (
                <div key={request.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <h3 className="font-semibold">{request.memberName}</h3>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {request.currentStatus} → {request.requestedStatus}
                      </Badge>
                      {currentUser.role === 'admin' && request.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleReviewRequest(request)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Reason for Change:</Label>
                      <p className="text-sm text-gray-600 mt-1">{request.reason}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-gray-500">Submitted:</Label>
                        <p>{new Date(request.submittedDate).toLocaleString()}</p>
                      </div>
                      {request.reviewedDate && (
                        <div>
                          <Label className="text-xs text-gray-500">Reviewed:</Label>
                          <p>{new Date(request.reviewedDate).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">by {request.reviewedBy}</p>
                        </div>
                      )}
                    </div>
                    
                    {request.adminNotes && (
                      <div className="bg-gray-50 p-3 rounded">
                        <Label className="text-sm font-medium">Admin Notes:</Label>
                        <p className="text-sm text-gray-600 mt-1">{request.adminNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Review Request Dialog (Admin Only) */}
      {currentUser.role === 'admin' && (
        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Review Status Request
              </DialogTitle>
              <DialogDescription>
                Review and approve or reject the status change request
              </DialogDescription>
            </DialogHeader>
            
            {selectedRequest && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedRequest.memberName}</h3>
                  <div className="text-sm space-y-1">
                    <p><strong>Current Status:</strong> {selectedRequest.currentStatus}</p>
                    <p><strong>Requested Status:</strong> {selectedRequest.requestedStatus}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedRequest.submittedDate).toLocaleString()}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Member's Reason:</Label>
                  <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                    {selectedRequest.reason}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reviewDecision">Decision *</Label>
                  <Select value={reviewDecision} onValueChange={setReviewDecision}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">✅ Approve Request</SelectItem>
                      <SelectItem value="rejected">❌ Reject Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Add notes about your decision..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>

                {reviewDecision === 'rejected' && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Please provide clear feedback in the admin notes explaining why the request was rejected and what steps the member can take.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsReviewDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitReview}
                disabled={!reviewDecision}
                className={reviewDecision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
              >
                {reviewDecision === 'approved' ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Request
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Request
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Submit Status Request Dialog (Member Only) */}
      {currentUser.role === 'member' && (
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Request Status Change
              </DialogTitle>
              <DialogDescription>
                Submit a request to change your membership status
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-1">Current Status</h3>
                <Badge className={statusDefinitions[currentUser.currentStatus].color}>
                  {statusDefinitions[currentUser.currentStatus].icon}
                  {currentUser.currentStatus}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestedStatus">Requested Status *</Label>
                <Select value={newRequest.requestedStatus} onValueChange={(value) => setNewRequest(prev => ({...prev, requestedStatus: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(statusDefinitions)
                      .filter(status => status !== currentUser.currentStatus && canRequestStatus(status))
                      .map(status => (
                        <SelectItem key={status} value={status}>
                          {statusDefinitions[status].icon}
                          {status}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Change *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you are requesting this status change..."
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest(prev => ({...prev, reason: e.target.value}))}
                  className="min-h-[100px]"
                />
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  All status change requests require administrative approval. You will be notified once your request has been reviewed.
                </AlertDescription>
              </Alert>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSubmitDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitStatusRequest}
                disabled={!newRequest.requestedStatus || !newRequest.reason.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}