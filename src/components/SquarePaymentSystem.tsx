import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Receipt, 
  Calendar,
  User,
  Building,
  Shield,
  Info,
  ExternalLink
} from 'lucide-react';

// Mock payment data
const paymentOptions = [
  {
    id: 'national_dues',
    name: 'National Dues',
    description: 'Annual national membership dues',
    amount: 150.00,
    frequency: 'Annual',
    dueDate: '2024-03-01',
    category: 'dues',
    required: true
  },
  {
    id: 'chapter_dues',
    name: 'Chapter Dues',
    description: 'Local chapter membership dues',
    amount: 75.00,
    frequency: 'Semester',
    dueDate: '2024-02-15',
    category: 'dues',
    required: true
  },
  {
    id: 'event_fee',
    name: 'Annual Convention Fee',
    description: 'Registration fee for annual convention',
    amount: 200.00,
    frequency: 'One-time',
    dueDate: '2024-04-01',
    category: 'event',
    required: false
  },
  {
    id: 'merchandise',
    name: 'Lambda Empire Merchandise',
    description: 'Official Lambda Empire apparel and accessories',
    amount: 0.00,
    frequency: 'Variable',
    dueDate: null,
    category: 'merchandise',
    required: false
  },
  {
    id: 'donation',
    name: 'General Donation',
    description: 'Support Lambda Empire initiatives',
    amount: 0.00,
    frequency: 'Variable',
    dueDate: null,
    category: 'donation',
    required: false
  }
];

const paymentHistory = [
  {
    id: 'PAY001',
    type: 'National Dues',
    amount: 150.00,
    status: 'completed',
    date: '2024-01-15T10:30:00Z',
    method: 'Credit Card',
    transactionId: 'sq_1234567890',
    receipt: 'receipt_001.pdf'
  },
  {
    id: 'PAY002',
    type: 'Chapter Dues',
    amount: 75.00,
    status: 'completed',
    date: '2024-01-10T14:20:00Z',
    method: 'Debit Card',
    transactionId: 'sq_0987654321',
    receipt: 'receipt_002.pdf'
  },
  {
    id: 'PAY003',
    type: 'Event Fee',
    amount: 200.00,
    status: 'pending',
    date: '2024-01-20T09:15:00Z',
    method: 'Credit Card',
    transactionId: 'sq_1122334455',
    receipt: null
  }
];

export default function SquarePaymentSystem() {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Mock member data
  const currentMember = {
    id: 'LEM001234',
    name: 'John Doe',
    email: 'john.doe@email.com',
    chapter: 'Alpha Chapter',
    outstandingBalance: 225.00
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'dues': return <Building className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      case 'merchandise': return <Receipt className="h-4 w-4" />;
      case 'donation': return <DollarSign className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const initiatePayment = (paymentOption) => {
    setSelectedPayment(paymentOption);
    setCustomAmount(paymentOption.amount > 0 ? paymentOption.amount.toString() : '');
    setIsPaymentDialogOpen(true);
    setPaymentError('');
  };

  const processSquarePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    try {
      // Simulate Square payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock Square API call
      const paymentData = {
        amount: parseFloat(customAmount),
        currency: 'USD',
        source_id: 'card_token_from_square',
        idempotency_key: `payment_${Date.now()}`,
        location_id: 'lambda_empire_location',
        note: `${selectedPayment.name} - ${currentMember.name}`,
        app_fee_money: {
          amount: Math.round(parseFloat(customAmount) * 0.029 * 100), // 2.9% processing fee
          currency: 'USD'
        }
      };

      console.log('Processing Square payment:', paymentData);

      // Simulate successful payment
      const mockResponse = {
        payment: {
          id: `sq_${Date.now()}`,
          status: 'COMPLETED',
          amount_money: {
            amount: parseFloat(customAmount) * 100, // Square uses cents
            currency: 'USD'
          },
          receipt_number: `REC${Date.now()}`,
          receipt_url: `https://squareup.com/receipt/${Date.now()}`
        }
      };

      setPaymentSuccess(true);
      
      // Close dialog after showing success
      setTimeout(() => {
        setIsPaymentDialogOpen(false);
        setPaymentSuccess(false);
        setSelectedPayment(null);
        setCustomAmount('');
      }, 3000);

    } catch (error) {
      setPaymentError('Payment processing failed. Please try again or contact support.');
      console.error('Square payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openSquareInvoice = (paymentOption) => {
    // Generate Square invoice URL (this would be a real Square invoice in production)
    const invoiceUrl = `https://squareup.com/invoice/lambda-empire/${paymentOption.id}`;
    window.open(invoiceUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CreditCard className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Payment Center</h1>
              <p className="text-white/90 mt-1">Secure payments powered by Square</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Outstanding Balance</p>
            <p className="text-2xl font-bold">${currentMember.outstandingBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Square Integration Info */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Secure Payment Processing:</strong> All payments are processed securely through Square. 
          Your payment information is encrypted and never stored on our servers. 
          <a href="https://squareup.com/security" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
            Learn more about Square's security <ExternalLink className="h-3 w-3 inline" />
          </a>
        </AlertDescription>
      </Alert>

      {/* Payment Options */}
      <Card>
        <CardHeader>
          <CardTitle>Available Payments</CardTitle>
          <CardDescription>
            Select a payment option to proceed with Square checkout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentOptions.map((option) => (
              <div key={option.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getCategoryIcon(option.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{option.name}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>
                  {option.required && (
                    <Badge className="bg-red-100 text-red-800">Required</Badge>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  {option.amount > 0 && (
                    <p className="text-lg font-bold text-green-600">
                      ${option.amount.toFixed(2)}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    <strong>Frequency:</strong> {option.frequency}
                  </p>
                  {option.dueDate && (
                    <p className="text-sm text-gray-500">
                      <strong>Due Date:</strong> {new Date(option.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => initiatePayment(option)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay with Square
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openSquareInvoice(option)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Your recent payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Receipt className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{payment.type}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(payment.date).toLocaleDateString()} • {payment.method}
                    </p>
                    <p className="text-xs text-gray-500">
                      Transaction ID: {payment.transactionId}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold">${payment.amount.toFixed(2)}</p>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  {payment.receipt && (
                    <Button size="sm" variant="outline">
                      <Receipt className="h-3 w-3 mr-1" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Square Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Square Payment
            </DialogTitle>
            <DialogDescription>
              Complete your payment securely through Square
            </DialogDescription>
          </DialogHeader>
          
          {paymentSuccess ? (
            <div className="text-center py-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">
                Your payment of ${customAmount} has been processed successfully.
              </p>
            </div>
          ) : (
            selectedPayment && (
              <div className="space-y-4">
                {/* Payment Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">{selectedPayment.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{selectedPayment.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-500">Member</Label>
                      <p className="font-medium">{currentMember.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Chapter</Label>
                      <p className="font-medium">{currentMember.chapter}</p>
                    </div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="pl-10"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                {/* Square Payment Form Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <CreditCard className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Square Payment Form
                  </p>
                  <p className="text-xs text-gray-500">
                    In production, this would be the Square Web Payments SDK form
                  </p>
                </div>

                {/* Processing Fee Info */}
                {customAmount && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${parseFloat(customAmount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Processing Fee (2.9%):</span>
                      <span>${(parseFloat(customAmount || 0) * 0.029).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-sm border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>${(parseFloat(customAmount || 0) * 1.029).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {paymentError && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {paymentError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Security Notice */}
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <Shield className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <p>
                    Your payment is secured by Square's industry-leading encryption. 
                    Lambda Empire does not store your payment information.
                  </p>
                </div>
              </div>
            )
          )}
          
          {!paymentSuccess && (
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={processSquarePayment}
                disabled={isProcessing || !customAmount || parseFloat(customAmount) <= 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ${(parseFloat(customAmount || 0) * 1.029).toFixed(2)}
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Square Integration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Square Integration Information</CardTitle>
          <CardDescription>
            How Lambda Empire uses Square for secure payment processing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                Security & Compliance
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• PCI DSS Level 1 compliant</li>
                <li>• End-to-end encryption</li>
                <li>• Fraud detection & prevention</li>
                <li>• Secure tokenization</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Accepted Payment Methods
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Visa, Mastercard, American Express</li>
                <li>• Discover, JCB, UnionPay</li>
                <li>• Apple Pay, Google Pay</li>
                <li>• ACH bank transfers</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600">
              <strong>Processing Fees:</strong> Square charges a 2.9% + $0.30 processing fee for card payments. 
              This fee is automatically calculated and added to your payment total.
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Info className="h-4 w-4" />
            <p>
              For questions about payments or refunds, contact our finance team at 
              <a href="mailto:finance@lambdaempire.org" className="text-blue-600 hover:underline ml-1">
                finance@lambdaempire.org
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}