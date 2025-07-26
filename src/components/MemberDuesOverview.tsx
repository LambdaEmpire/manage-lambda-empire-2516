import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Calendar, CheckCircle, XCircle, Info } from 'lucide-react';

// Mock data for dues periods and member dues (same as QuarterlyDuesManagement for consistency)
const duesPeriods = [
  { id: 'Q1_2024', name: 'Q1 2024', startDate: '2024-01-01', endDate: '2024-03-31', status: 'active', defaultAmount: 50 },
  { id: 'Q4_2023', name: 'Q4 2023', startDate: '2023-10-01', endDate: '2023-12-31', status: 'closed', defaultAmount: 50 },
];

const memberDuesData = [
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

// Mock current member (this would come from auth context in a real app)
const currentMemberId = 'LEM001234'; 

export default function MemberDuesOverview() {
  const [memberDues, setMemberDues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate fetching data for the current member
    const fetchMemberDues = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call to fetch dues for currentMemberId
        await new Promise(resolve => setTimeout(resolve, 500)); 
        const memberData = memberDuesData.find(m => m.memberId === currentMemberId);
        if (memberData) {
          setMemberDues(memberData.dues);
        } else {
          setError('Member dues data not found.');
        }
      } catch (err) {
        setError('Failed to load dues data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDues();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'outstanding': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'outstanding': return <Info className="h-4 w-4" />;
      case 'overdue': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handlePayDues = (periodId) => {
    // In a real app, this would redirect to the SquarePaymentSystem component
    console.log(`Initiating payment for dues period: ${periodId}`);
    alert(`Redirecting to payment for ${periodId}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading dues information...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const outstandingDues = memberDues.filter(dues => dues.status === 'outstanding' || dues.status === 'overdue');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Quarterly Dues</CardTitle>
        <CardDescription>
          View your outstanding and paid quarterly dues.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {outstandingDues.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">You are all caught up!</h3>
            <p className="text-gray-600 mt-2">No outstanding quarterly dues at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {outstandingDues.map(duesEntry => {
              const period = duesPeriods.find(p => p.id === duesEntry.periodId);
              return (
                <div key={duesEntry.periodId} className="border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{period?.name || duesEntry.periodId}</h3>
                    <p className="text-sm text-gray-600">Due: {new Date(duesEntry.dueDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">Amount: ${duesEntry.amountDue.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(duesEntry.status)}>
                      {getStatusIcon(duesEntry.status)}
                      {duesEntry.status.charAt(0).toUpperCase() + duesEntry.status.slice(1)}
                    </Badge>
                    <Button size="sm" onClick={() => handlePayDues(duesEntry.periodId)}>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}