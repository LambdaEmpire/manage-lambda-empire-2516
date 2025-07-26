import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StatusMonitoringSystem from '@/components/StatusMonitoringSystem';
import StatusChangeLog from '@/components/StatusChangeLog';
import MemberStatusRequest from '@/components/MemberStatusRequest';

export default function StatusManagement() {
  return (
    <div className="animate-fade-in">
      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="monitoring">Automated Monitoring</TabsTrigger>
          <TabsTrigger value="log">Status Change Log</TabsTrigger>
          <TabsTrigger value="request">Member Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="monitoring">
          <StatusMonitoringSystem />
        </TabsContent>
        
        <TabsContent value="log">
          <StatusChangeLog />
        </TabsContent>
        
        <TabsContent value="request">
          <MemberStatusRequest />
        </TabsContent>
      </Tabs>
    </div>
  );
}