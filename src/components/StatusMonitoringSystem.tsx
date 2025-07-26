import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Award, 
  Calendar, 
  Users, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  Bell,
  XCircle
} from 'lucide-react';

// Status criteria configuration
const statusCriteria = [
  {
    id: 'dues_payment',
    name: 'Dues Payment',
    description: 'Member must have paid dues within specified timeframe',
    icon: DollarSign,
    type: 'payment',
    defaultEnabled: true,
    defaultThreshold: 90, // days
    actions: ['inactive', 'suspended'],
    severity: 'high'
  },
  {
    id: 'service_hours',
    name: 'Service Hours',
    description: 'Member must complete minimum service hours per period',
    icon: Award,
    type: 'hours',
    defaultEnabled: true,
    defaultThreshold: 20, // hours per semester
    actions: ['inactive'],
    severity: 'medium'
  },
  {
    id: 'event_attendance',
    name: 'Event Attendance',
    description: 'Member must attend minimum percentage of events',
    icon: Calendar,
    type: 'percentage',
    defaultEnabled: true,
    defaultThreshold: 60, // percentage
    actions: ['inactive'],
    severity: 'medium'
  },
  {
    id: 'communication_response',
    name: 'Communication Response',
    description: 'Member must respond to official communications within timeframe',
    icon: Bell,
    type: 'days',
    defaultEnabled: false,
    defaultThreshold: 7, // days
    actions: ['inactive'],
    severity: 'low'
  },
  {
    id: 'profile_completion',
    name: 'Profile Completion',
    description: 'Member profile must be complete and up-to-date',
    icon: Users,
    type: 'percentage',
    defaultEnabled: false,
    defaultThreshold: 80, // percentage complete
    actions: ['inactive'],
    severity: 'low'
  }
];

// Mock member data with compliance tracking
const membersWithCompliance = [
  {
    id: 'LEM001234',
    name: 'John Doe',
    currentStatus: 'Active',
    compliance: {
      dues_payment: { status: 'compliant', lastPayment: '2024-01-15', daysOverdue: 0 },
      service_hours: { status: 'non_compliant', completed: 12, required: 20, deficit: 8 },
      event_attendance: { status: 'compliant', attended: 8, total: 10, percentage: 80 },
      communication_response: { status: 'compliant', avgResponseTime: 2 },
      profile_completion: { status: 'compliant', completeness: 95 }
    },
    riskLevel: 'medium',
    lastStatusCheck: '2024-01-20T10:00:00Z'
  },
  {
    id: 'LEM001235',
    name: 'Sarah Johnson',
    currentStatus: 'Active',
    compliance: {
      dues_payment: { status: 'non_compliant', lastPayment: '2023-10-15', daysOverdue: 95 },
      service_hours: { status: 'compliant', completed: 25, required: 20, deficit: 0 },
      event_attendance: { status: 'non_compliant', attended: 4, total: 10, percentage: 40 },
      communication_response: { status: 'non_compliant', avgResponseTime: 12 },
      profile_completion: { status: 'compliant', completeness: 90 }
    },
    riskLevel: 'high',
    lastStatusCheck: '2024-01-20T10:00:00Z'
  },
  {
    id: 'LEM001236',
    name: 'Michael Brown',
    currentStatus: 'Active',
    compliance: {
      dues_payment: { status: 'compliant', lastPayment: '2024-01-10', daysOverdue: 0 },
      service_hours: { status: 'compliant', completed: 30, required: 20, deficit: 0 },
      event_attendance: { status: 'compliant', attended: 9, total: 10, percentage: 90 },
      communication_response: { status: 'compliant', avgResponseTime: 1 },
      profile_completion: { status: 'compliant', completeness: 100 }
    },
    riskLevel: 'low',
    lastStatusCheck: '2024-01-20T10:00:00Z'
  }
];

export default function StatusMonitoringSystem() {
  const [criteria, setCriteria] = useState(statusCriteria.map(c => ({
    ...c,
    enabled: c.defaultEnabled,
    threshold: c.defaultThreshold,
    action: c.actions[0]
  })));
  const [members] = useState(membersWithCompliance);
  const [isMonitoringActive, setIsMonitoringActive] = useState(true);
  const [lastScan, setLastScan] = useState(new Date());
  const [pendingActions, setPendingActions] = useState([]);

  // Calculate members at risk
  const membersAtRisk = members.filter(member => member.riskLevel === 'high' || member.riskLevel === 'medium');
  const membersForSuspension = members.filter(member => 
    member.compliance.dues_payment.status === 'non_compliant' && 
    member.compliance.dues_payment.daysOverdue > 90
  );

  const updateCriteria = (id: string, field: string, value: any) => {
    setCriteria(prev => prev.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const runStatusCheck = async () => {
    console.log('Running automated status check...');
    setLastScan(new Date());
    
    // Simulate status check process
    const actions = [];
    
    members.forEach(member => {
      criteria.forEach(criterion => {
        if (!criterion.enabled) return;
        
        const compliance = member.compliance[criterion.id];
        if (!compliance || compliance.status === 'compliant') return;
        
        // Determine action based on criteria
        let shouldTakeAction = false;
        
        switch (criterion.type) {
          case 'payment':
            shouldTakeAction = compliance.daysOverdue > criterion.threshold;
            break;
          case 'hours':
            shouldTakeAction = compliance.deficit > 0;
            break;
          case 'percentage':
            shouldTakeAction = compliance.percentage < criterion.threshold;
            break;
          case 'days':
            shouldTakeAction = compliance.avgResponseTime > criterion.threshold;
            break;
        }
        
        if (shouldTakeAction) {
          actions.push({
            memberId: member.id,
            memberName: member.name,
            criterion: criterion.name,
            currentStatus: member.currentStatus,
            proposedAction: criterion.action,
            reason: getActionReason(criterion, compliance),
            severity: criterion.severity,
            timestamp: new Date().toISOString()
          });
        }
      });
    });
    
    setPendingActions(actions);
  };

  const getActionReason = (criterion, compliance) => {
    switch (criterion.id) {
      case 'dues_payment':
        return `Dues overdue by ${compliance.daysOverdue} days`;
      case 'service_hours':
        return `${compliance.deficit} hours short of requirement`;
      case 'event_attendance':
        return `Only ${compliance.percentage}% attendance rate`;
      case 'communication_response':
        return `Average response time: ${compliance.avgResponseTime} days`;
      default:
        return 'Criteria not met';
    }
  };

  const executeAction = (action) => {
    console.log(`Executing action: ${action.proposedAction} for ${action.memberName}`);
    // This would typically update the member's status in the database
    setPendingActions(prev => prev.filter(a => a !== action));
  };

  const dismissAction = (action) => {
    setPendingActions(prev => prev.filter(a => a !== action));
  };

  useEffect(() => {
    // Run initial status check
    runStatusCheck();
    
    // Set up automatic monitoring (every hour in production)
    const interval = setInterval(() => {
      if (isMonitoringActive) {
        runStatusCheck();
      }
    }, 60000); // 1 minute for demo, would be 1 hour in production
    
    return () => clearInterval(interval);
  }, [isMonitoringActive, criteria]);

  return (
    <div className="space-y-6">
      {/* Monitoring Status Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Settings className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Automated Status Monitoring</h1>
              <p className="text-white/90 mt-1">Monitor member compliance and automatically update status</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-white/80">Last Scan</p>
              <p className="font-semibold">{lastScan.toLocaleTimeString()}</p>
            </div>
            <Button
              onClick={() => setIsMonitoringActive(!isMonitoringActive)}
              className={`${isMonitoringActive ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
            >
              {isMonitoringActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isMonitoringActive ? 'Active' : 'Paused'}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{members.filter(m => m.riskLevel === 'low').length}</div>
            <div className="text-sm text-gray-600">Compliant Members</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{members.filter(m => m.riskLevel === 'medium').length}</div>
            <div className="text-sm text-gray-600">At Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{members.filter(m => m.riskLevel === 'high').length}</div>
            <div className="text-sm text-gray-600">High Risk</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{pendingActions.length}</div>
            <div className="text-sm text-gray-600">Pending Actions</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Actions */}
      {pendingActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pending Status Actions ({pendingActions.length})
            </CardTitle>
            <CardDescription>
              Review and approve automatic status changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={
                      action.severity === 'high' ? 'bg-red-100 text-red-800' :
                      action.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {action.severity}
                    </Badge>
                    <div>
                      <p className="font-semibold">{action.memberName}</p>
                      <p className="text-sm text-gray-600">
                        {action.criterion}: {action.reason}
                      </p>
                      <p className="text-xs text-gray-500">
                        Proposed: {action.currentStatus} → {action.proposedAction}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => executeAction(action)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Execute
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dismissAction(action)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Criteria Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Status Criteria Configuration</CardTitle>
          <CardDescription>
            Configure automatic status monitoring rules and thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {criteria.map((criterion) => {
              const IconComponent = criterion.icon;
              return (
                <div key={criterion.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        criterion.severity === 'high' ? 'bg-red-100' :
                        criterion.severity === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <IconComponent className={`h-5 w-5 ${
                          criterion.severity === 'high' ? 'text-red-600' :
                          criterion.severity === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{criterion.name}</h3>
                        <p className="text-sm text-gray-600">{criterion.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={criterion.enabled}
                      onCheckedChange={(checked) => updateCriteria(criterion.id, 'enabled', checked)}
                    />
                  </div>
                  
                  {criterion.enabled && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Threshold ({criterion.type === 'percentage' ? '%' : 
                                   criterion.type === 'days' ? 'days' : 
                                   criterion.type === 'hours' ? 'hours' : 'days'})
                        </Label>
                        <Input
                          type="number"
                          value={criterion.threshold}
                          onChange={(e) => updateCriteria(criterion.id, 'threshold', parseInt(e.target.value))}
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Action</Label>
                        <Select 
                          value={criterion.action} 
                          onValueChange={(value) => updateCriteria(criterion.id, 'action', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {criterion.actions.map((action) => (
                              <SelectItem key={action} value={action}>
                                {action.charAt(0).toUpperCase() + action.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Severity</Label>
                        <Badge className={
                          criterion.severity === 'high' ? 'bg-red-100 text-red-800' :
                          criterion.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {criterion.severity}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Member Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Member Compliance Status</CardTitle>
          <CardDescription>
            Current compliance status for all members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">ID: {member.id}</p>
                    </div>
                    <Badge className={
                      member.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      member.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {member.riskLevel} risk
                    </Badge>
                  </div>
                  <Badge variant="outline">{member.currentStatus}</Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(member.compliance).map(([key, compliance]) => {
                    const criterion = criteria.find(c => c.id === key);
                    if (!criterion?.enabled) return null;
                    
                    return (
                      <div key={key} className="text-center">
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                          compliance.status === 'compliant' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {compliance.status === 'compliant' ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> :
                            <XCircle className="h-4 w-4 text-red-600" />
                          }
                        </div>
                        <p className="text-xs font-medium">{criterion.name}</p>
                        <p className="text-xs text-gray-500">
                          {key === 'dues_payment' && `${compliance.daysOverdue}d overdue`}
                          {key === 'service_hours' && `${compliance.completed}/${compliance.required}h`}
                          {key === 'event_attendance' && `${compliance.percentage}%`}
                          {key === 'communication_response' && `${compliance.avgResponseTime}d avg`}
                          {key === 'profile_completion' && `${compliance.completeness}%`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manual Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Controls</CardTitle>
          <CardDescription>
            Manual status monitoring controls and actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={runStatusCheck} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Status Check Now
            </Button>
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Export Compliance Report
            </Button>
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Send Compliance Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}