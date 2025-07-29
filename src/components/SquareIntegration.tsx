import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Key,
  Shield,
  DollarSign,
  BarChart3,
  Smartphone,
  Globe,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  Trash2
} from 'lucide-react';

// Mock Square integration data
const mockSquareData = {
  connected: false,
  applicationId: '',
  accessToken: '',
  environment: 'sandbox', // 'sandbox' or 'production'
  webhookUrl: '',
  lastSync: null,
  accountInfo: {
    businessName: '',
    merchantId: '',
    country: '',
    currency: 'USD'
  },
  permissions: {
    payments: false,
    orders: false,
    customers: false,
    inventory: false
  },
  recentTransactions: []
};

export default function SquareIntegration() {
  const [squareConfig, setSquareConfig] = useState(mockSquareData);
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [setupData, setSetupData] = useState({
    applicationId: '',
    accessToken: '',
    environment: 'sandbox'
  });
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [testResults, setTestResults] = useState(null);

  const handleConnectSquare = () => {
    setSetupStep(1);
    setSetupData({
      applicationId: '',
      accessToken: '',
      environment: 'sandbox'
    });
    setIsSetupDialogOpen(true);
  };

  const testConnection = async () => {
    setIsTestingConnection(true);
    setTestResults(null);

    try {
      // Simulate API call to test Square connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful connection
      const mockResults = {
        success: true,
        accountInfo: {
          businessName: 'Lambda Empire Organization',
          merchantId: 'MERCHANT_123456',
          country: 'US',
          currency: 'USD'
        },
        permissions: {
          payments: true,
          orders: true,
          customers: true,
          inventory: false
        }
      };

      setTestResults(mockResults);
      setConnectionStatus('connected');
    } catch (error) {
      setTestResults({
        success: false,
        error: 'Failed to connect to Square API. Please check your credentials.'
      });
      setConnectionStatus('error');
    } finally {
      setIsTestingConnection(false);
    }
  };

  const saveSquareConfig = async () => {
    if (!testResults?.success) return;

    // Save configuration
    setSquareConfig({
      ...squareConfig,
      connected: true,
      applicationId: setupData.applicationId,
      accessToken: setupData.accessToken,
      environment: setupData.environment,
      lastSync: new Date().toISOString(),
      accountInfo: testResults.accountInfo,
      permissions: testResults.permissions
    });

    setIsSetupDialogOpen(false);
    setSetupStep(1);
  };

  const disconnectSquare = () => {
    setSquareConfig({
      ...mockSquareData,
      connected: false
    });
    setConnectionStatus('disconnected');
    setTestResults(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const generateWebhookUrl = () => {
    return `${window.location.origin}/api/webhooks/square`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CreditCard className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Square Payment Integration</h1>
              <p className="text-white/90 mt-1">Connect your Square account for seamless payment processing</p>
            </div>
          </div>
          <Badge className={squareConfig.connected ? 'bg-green-500' : 'bg-yellow-500'}>
            {squareConfig.connected ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Connection Status
          </CardTitle>
          <CardDescription>
            Current status of your Square payment integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!squareConfig.connected ? (
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Square Not Connected</h3>
              <p className="text-gray-600 mb-4">
                Connect your Square account to enable payment processing for dues, donations, and event fees.
              </p>
              <Button onClick={handleConnectSquare} className="bg-green-600 hover:bg-green-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Connect Square Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">Successfully Connected</h3>
                    <p className="text-sm text-green-600">
                      {squareConfig.accountInfo.businessName} • {squareConfig.environment.toUpperCase()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnectSquare}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Account Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Business Name:</span>
                      <span className="font-medium">{squareConfig.accountInfo.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant ID:</span>
                      <span className="font-medium font-mono">{squareConfig.accountInfo.merchantId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Environment:</span>
                      <Badge variant={squareConfig.environment === 'production' ? 'default' : 'secondary'}>
                        {squareConfig.environment.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Currency:</span>
                      <span className="font-medium">{squareConfig.accountInfo.currency}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">API Permissions</h4>
                  <div className="space-y-2">
                    {Object.entries(squareConfig.permissions).map(([permission, enabled]) => (
                      <div key={permission} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{permission}</span>
                        <Badge className={enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Last synchronized: {new Date(squareConfig.lastSync).toLocaleString()}</span>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuration Tabs */}
      {squareConfig.connected && (
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>
                  Configure how Square payments are processed for your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Payment Types</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Credit/Debit Cards</Label>
                          <p className="text-sm text-gray-600">Accept Visa, Mastercard, Amex, Discover</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Digital Wallets</Label>
                          <p className="text-sm text-gray-600">Apple Pay, Google Pay, Samsung Pay</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">ACH Bank Transfers</Label>
                          <p className="text-sm text-gray-600">Direct bank account payments</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Processing Options</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Automatic Capture</Label>
                          <p className="text-sm text-gray-600">Immediately capture payments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Receipt Emails</Label>
                          <p className="text-sm text-gray-600">Send email receipts to customers</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="font-medium">Save Payment Methods</Label>
                          <p className="text-sm text-gray-600">Store cards for future payments</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Configuration</CardTitle>
                <CardDescription>
                  Set up webhooks to receive real-time payment notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhookUrl"
                      value={generateWebhookUrl()}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generateWebhookUrl())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600">
                    Add this URL to your Square webhook settings to receive payment notifications
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Webhook Events</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'payment.created',
                      'payment.updated',
                      'refund.created',
                      'refund.updated',
                      'order.created',
                      'order.updated',
                      'customer.created',
                      'customer.updated'
                    ].map(event => (
                      <div key={event} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm font-mono">{event}</span>
                        <Switch defaultChecked={event.includes('payment') || event.includes('refund')} />
                      </div>
                    ))}
                  </div>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Configure these webhook events in your Square Developer Dashboard to enable real-time payment processing updates.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Settings className="h-4 w-4 mr-2" />
                    Save Webhook Config
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Square Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>
                  Monitor your Square payment processing performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">$12,450</div>
                    <div className="text-sm text-gray-600">Total Processed</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm text-gray-600">Transactions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">98.7%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Detailed analytics will be available once you start processing payments.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Square Setup Dialog */}
      <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Connect Square Account
            </DialogTitle>
            <DialogDescription>
              Set up your Square payment integration in {setupStep} simple steps
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Step Progress */}
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map(step => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= setupStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-2" />}
                </div>
              ))}
            </div>

            {/* Step 1: Environment Selection */}
            {setupStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 1: Choose Environment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      setupData.environment === 'sandbox' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSetupData(prev => ({...prev, environment: 'sandbox'}))}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-5 w-5" />
                      <h4 className="font-medium">Sandbox (Testing)</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Use Square's testing environment for development and testing. No real money is processed.
                    </p>
                  </div>
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      setupData.environment === 'production' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => setSetupData(prev => ({...prev, environment: 'production'}))}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-5 w-5" />
                      <h4 className="font-medium">Production (Live)</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Use Square's live environment for real payment processing. Real money will be processed.
                    </p>
                  </div>
                </div>
                <Button onClick={() => setSetupStep(2)} className="w-full">
                  Continue to Credentials
                </Button>
              </div>
            )}

            {/* Step 2: API Credentials */}
            {setupStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 2: Enter API Credentials</h3>
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    Get your API credentials from the Square Developer Dashboard. 
                    <Button variant="link" className="p-0 h-auto ml-1">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open Square Dashboard
                    </Button>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicationId">Application ID *</Label>
                    <Input
                      id="applicationId"
                      placeholder="sq0idp-..."
                      value={setupData.applicationId}
                      onChange={(e) => setSetupData(prev => ({...prev, applicationId: e.target.value}))}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accessToken">Access Token *</Label>
                    <div className="relative">
                      <Input
                        id="accessToken"
                        type={showAccessToken ? "text" : "password"}
                        placeholder={setupData.environment === 'sandbox' ? 'EAAAl...' : 'EAAAE...'}
                        value={setupData.accessToken}
                        onChange={(e) => setSetupData(prev => ({...prev, accessToken: e.target.value}))}
                        className="font-mono pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowAccessToken(!showAccessToken)}
                      >
                        {showAccessToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSetupStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setSetupStep(3)}
                    disabled={!setupData.applicationId || !setupData.accessToken}
                    className="flex-1"
                  >
                    Test Connection
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Test Connection */}
            {setupStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 3: Test Connection</h3>
                
                {!testResults && (
                  <div className="text-center py-8">
                    <Button 
                      onClick={testConnection}
                      disabled={isTestingConnection}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isTestingConnection ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Testing Connection...
                        </div>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Test Square Connection
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {testResults && (
                  <div className={`p-4 rounded-lg border-2 ${
                    testResults.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {testResults.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      )}
                      <h4 className={`font-medium ${
                        testResults.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {testResults.success ? 'Connection Successful!' : 'Connection Failed'}
                      </h4>
                    </div>
                    
                    {testResults.success ? (
                      <div className="text-sm space-y-1">
                        <p><strong>Business:</strong> {testResults.accountInfo.businessName}</p>
                        <p><strong>Merchant ID:</strong> {testResults.accountInfo.merchantId}</p>
                        <p><strong>Environment:</strong> {setupData.environment.toUpperCase()}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-red-700">{testResults.error}</p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSetupStep(2)}>
                    Back
                  </Button>
                  {testResults?.success && (
                    <Button onClick={saveSquareConfig} className="flex-1 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Setup
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}