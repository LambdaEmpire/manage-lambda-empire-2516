import SquarePaymentSystem from '@/components/SquarePaymentSystem';
import MemberDuesOverview from '@/components/MemberDuesOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Calendar, DollarSign, FileText } from 'lucide-react';

// Mock fines data
const memberFines = [
  {
    id: 'FINE001',
    description: 'Late submission of monthly report',
    amount: 25.00,
    dueDate: '2024-02-15',
    status: 'outstanding',
    issuedDate: '2024-01-15',
    reasoning: 'Monthly chapter report was submitted 3 days after the deadline. As per Lambda Empire policy, late submissions incur a $25 administrative fine.'
  },
  {
    id: 'FINE002',
    description: 'Missed mandatory training session',
    amount: 50.00,
    dueDate: '2024-02-28',
    status: 'outstanding',
    issuedDate: '2024-01-28',
    reasoning: 'Failed to attend the mandatory leadership training session on January 20, 2024. Make-up session required along with administrative fine.'
  },
  {
    id: 'FINE003',
    description: 'Uniform violation at regional event',
    amount: 15.00,
    dueDate: '2024-01-31',
    status: 'paid',
    issuedDate: '2024-01-10',
    paidDate: '2024-01-25',
    reasoning: 'Dress code violation during the regional conference. Proper Lambda Empire attire is required at all official events.'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'outstanding': return 'bg-red-100 text-red-800';
    case 'paid': return 'bg-green-100 text-green-800';
    case 'overdue': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const isOverdue = (dueDate: string) => {
  return new Date() > new Date(dueDate);
};

export default function PaymentCenter() {
  const outstandingFines = memberFines.filter(fine => fine.status === 'outstanding');
  const totalOutstandingFines = outstandingFines.reduce((sum, fine) => sum + fine.amount, 0);

  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="dues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dues">My Dues</TabsTrigger>
          <TabsTrigger value="fines" className="relative">
            Fines
            {outstandingFines.length > 0 && (
              <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">
                {outstandingFines.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="payments">Make a Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dues">
          <MemberDuesOverview />
        </TabsContent>
        
        <TabsContent value="fines" className="space-y-6">
          {/* Fines Overview */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-6 rounded-xl text-white">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-12 w-12" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Member Fines</h1>
                <p className="text-white/90 mt-1">Outstanding fines and payment history</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  ${totalOutstandingFines.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Total Outstanding</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {outstandingFines.filter(fine => isOverdue(fine.dueDate)).length}
                </div>
                <div className="text-sm text-gray-600">Overdue Fines</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {memberFines.filter(fine => fine.status === 'paid').length}
                </div>
                <div className="text-sm text-gray-600">Paid This Year</div>
              </CardContent>
            </Card>
          </div>

          {/* Outstanding Fines */}
          {outstandingFines.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Outstanding Fines
                </CardTitle>
                <CardDescription>Fines that require immediate payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {outstandingFines.map(fine => (
                    <div key={fine.id} className={`border rounded-lg p-4 ${isOverdue(fine.dueDate) ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{fine.description}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span className="font-medium">${fine.amount.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Due: {new Date(fine.dueDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(isOverdue(fine.dueDate) ? 'overdue' : fine.status)}`}>
                            {isOverdue(fine.dueDate) ? 'Overdue' : fine.status}
                          </Badge>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Pay Now
                          </Button>
                        </div>
                      </div>
                      <div className="bg-white/50 rounded p-3 mt-3">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Reasoning:</p>
                            <p className="text-sm text-gray-600 mt-1">{fine.reasoning}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Issued: {new Date(fine.issuedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Fines History */}
          <Card>
            <CardHeader>
              <CardTitle>Fines History</CardTitle>
              <CardDescription>Complete record of all fines issued</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {memberFines.map(fine => (
                  <div key={fine.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold">{fine.description}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${fine.amount.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {new Date(fine.dueDate).toLocaleDateString()}</span>
                          </div>
                          {fine.paidDate && (
                            <div className="flex items-center gap-1">
                              <span>Paid: {new Date(fine.paidDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={getStatusColor(fine.status)}>
                        {fine.status}
                      </Badge>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-600">{fine.reasoning}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Issued: {new Date(fine.issuedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <SquarePaymentSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}