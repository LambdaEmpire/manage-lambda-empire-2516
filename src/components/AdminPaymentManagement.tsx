import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Search, 
  Filter,
  Download,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink
} from 'lucide-react';

// Mock payment data for admin view
const allPayments = [
  {
    id: 'PAY001',
    memberId: 'LEM001234',
    memberName: 'John Doe',
    type: 'National Dues',
    amount: 150.00,
    status: 'completed',
    date: '2024-01-15T10:30:00Z',
    method: 'Credit Card',
    transactionId: 'sq_1234567890',
    squarePaymentId: 'sq_payment_123',
    processingFee: 4.65,
    netAmount: 145.35,
    chapter: 'Alpha Chapter'
  },
  {
    id: 'PAY002',
    memberId: 'LEM001235',
    memberName: 'Sarah Johnson',
    type: 'Chapter Dues',
    amount: 75.00,
    status: 'completed',
    date: '2024-01-14T14:20:00Z',
    method: 'Debit Card',
    transactionId: 'sq_0987654321',
    squarePaymentId: 'sq_payment_456',
    processingFee: 2.48,
    netAmount: 72.52,
    chapter: 'Beta Chapter'
  },
  {
    id: 'PAY003',
    memberId: 'LEM001236',
    memberName: 'Michael Brown',
    type: 'Event Fee',
    amount: 200.00,
    status: 'pending',
    date: '2024-01-20T09:15:00Z',
    method: 'Credit Card',
    transactionId: 'sq_1122334455',
    squarePaymentId: 'sq_payment_789',
    processingFee: 6.10,
    netAmount: 193.90,
    chapter: 'Gamma Chapter'
  },
  {
    id: 'PAY004',
    memberId: 'LEM001237',
    memberName: 'Emily White',
    type: 'National Dues',
    amount: 150.00,
    status: 'failed',
    date: '2024-01-18T16:45:00Z',
    method: 'Credit Card',
    transactionId: 'sq_9988776655',
    squarePaymentId: 'sq_payment_012',
    processingFee: 0.00,
    netAmount: 0.00,
    chapter: 'Delta Chapter'
  }
];

const paymentSummary = {
  totalRevenue: 397.52,
  totalFees: 13.23,
  netRevenue: 384.29,
  totalTransactions: 4,
  completedTransactions: 2,
  pendingTransactions: 1,
  failedTransactions: 1
};

export default function AdminPaymentManagement() {
  const [payments, setPayments] = useState(allPayments);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Filter payments
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const openSquareDashboard = () => {
    window.open('https://squareup.com/dashboard/payments', '_blank');
  };

  const exportPayments = () => {
    console.log('Exporting payment data...');
    // Implementation for exporting payment data
  };

  const refreshPayments = () => {
    console.log('Refreshing payment data from Square...');
    // Implementation for syncing with Square API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <DollarSign className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Payment Management</h1>
              <p className="text-white/90 mt-1">Monitor and manage all Square payments</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={openSquareDashboard}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Square Dashboard
            </Button>
            <Button
              onClick={refreshPayments}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${paymentSummary.netRevenue.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Net Revenue</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{paymentSummary.totalTransactions}</div>
            <div className="text-sm text-gray-600">Total Transactions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{paymentSummary.pendingTransactions}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">${paymentSummary.totalFees.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Processing Fees</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Payments</CardTitle>
          <CardDescription>Search and filter payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search member, ID, or transaction..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="National Dues">National Dues</SelectItem>
                  <SelectItem value="Chapter Dues">Chapter Dues</SelectItem>
                  <SelectItem value="Event Fee">Event Fee</SelectItem>
                  <SelectItem value="Donation">Donation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Actions</Label>
              <Button onClick={exportPayments} variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
          <CardDescription>
            All payment transactions processed through Square
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPayments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{payment.memberName}</h3>
                        <Badge variant="outline" className="text-xs">
                          {payment.memberId}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{payment.type}</p>
                      <p className="text-xs text-gray-500">
                        {payment.chapter} • {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">
                        Net: ${payment.netAmount.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(payment.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </div>
                      </Badge>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPayment(payment);
                        setIsDetailDialogOpen(true);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-gray-500">
                  <div>
                    <span className="font-medium">Transaction ID:</span> {payment.transactionId}
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span> {payment.method}
                  </div>
                  <div>
                    <span className="font-medium">Processing Fee:</span> ${payment.processingFee.toFixed(2)}
                  </div>
                  <div>
                    <span className="font-medium">Square ID:</span> {payment.squarePaymentId}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this Square payment
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Member</Label>
                  <p className="text-lg font-semibold">{selectedPayment.memberName}</p>
                  <p className="text-sm text-gray-600">{selectedPayment.memberId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Chapter</Label>
                  <p className="text-lg">{selectedPayment.chapter}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payment Type</Label>
                  <p className="text-lg">{selectedPayment.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedPayment.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedPayment.status)}
                      {selectedPayment.status}
                    </div>
                  </Badge>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Payment Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Amount:</span>
                    <span className="font-semibold">${selectedPayment.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Square Processing Fee:</span>
                    <span>-${selectedPayment.processingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Net Amount:</span>
                    <span className="text-green-600">${selectedPayment.netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Transaction Date</Label>
                  <p className="text-sm">{new Date(selectedPayment.date).toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm">{selectedPayment.method}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Transaction ID</Label>
                  <p className="text-sm font-mono">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Square Payment ID</Label>
                  <p className="text-sm font-mono">{selectedPayment.squarePaymentId}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => window.open(`https://squareup.com/dashboard/payments/${selectedPayment?.squarePaymentId}`, '_blank')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View in Square
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}