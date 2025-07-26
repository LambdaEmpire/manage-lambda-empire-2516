import SquarePaymentSystem from '@/components/SquarePaymentSystem';
import MemberDuesOverview from '@/components/MemberDuesOverview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PaymentCenter() {
  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="dues" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dues">My Dues</TabsTrigger>
          <TabsTrigger value="payments">Make a Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dues">
          <MemberDuesOverview />
        </TabsContent>
        
        <TabsContent value="payments">
          <SquarePaymentSystem />
        </TabsContent>
      </Tabs>
    </div>
  );
}