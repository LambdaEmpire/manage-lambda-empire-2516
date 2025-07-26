import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Upload,
  Send,
  Info
} from 'lucide-react';

const statusOptions = [
  {
    value: 'inactive',
    label: 'Inactive',
    description: 'Temporary leave while maintaining membership',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800',
    requiresReason: true,
    requiresDocuments: false
  },
  {
    value: 'non_member',
    label: 'Non-Member',
    description: 'Permanent resignation from Lambda Empire',
    icon: User,
    color: 'bg-gray-100 text-gray-800',
    requiresReason: true,
    requiresDocuments: false
  }
];

const reasonCategories = [
  { value: 'personal', label: 'Personal/Family Emergency' },
  { value: 'medical', label: 'Medical Leave' },
  { value: 'academic', label: 'Academic Focus' },
  { value: 'career', label: 'Career Change' },
  { value: 'relocation', label: 'Relocation' },
  { value: 'financial', label: 'Financial Hardship' },
  { value: 'other', label: 'Other' }
];

export default function MemberStatusRequest() {
  const [formData, setFormData] = useState({
    requestedStatus: '',
    reasonCategory: '',
    reason: '',
    expectedDuration: '',
    effectiveDate: '',
    contactDuringLeave: true,
    returnDate: '',
    additionalNotes: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Mock current member data
  const currentMember = {
    id: 'LEM001234',
    name: 'John Doe',
    currentStatus: 'Active',
    email: 'john.doe@email.com',
    chapter: 'Alpha Chapter',
    joinDate: '2020-03-15'
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError('');
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.requestedStatus) {
      setError('Please select a status to request');
      return false;
    }
    if (!formData.reasonCategory) {
      setError('Please select a reason category');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Please provide a detailed reason for your request');
      return false;
    }
    if (!formData.effectiveDate) {
      setError('Please specify when this change should take effect');
      return false;
    }
    return true;
  };

  const submitRequest = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Status change request submitted:', {
        ...formData,
        memberId: currentMember.id,
        memberName: currentMember.name,
        currentStatus: currentMember.currentStatus,
        uploadedFiles: uploadedFiles.map(f => f.name),
        submissionDate: new Date().toISOString()
      });

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedStatus = statusOptions.find(option => option.value === formData.requestedStatus);

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Submitted Successfully</h2>
            <p className="text-gray-600 mb-6">
              Your status change request has been submitted and is pending admin approval. 
              You will receive an email notification once your request has been reviewed.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Request Summary</h3>
              <div className="text-left text-sm space-y-1">
                <p><strong>Requested Status:</strong> {selectedStatus?.label}</p>
                <p><strong>Current Status:</strong> {currentMember.currentStatus}</p>
                <p><strong>Effective Date:</strong> {new Date(formData.effectiveDate).toLocaleDateString()}</p>
                <p><strong>Reason:</strong> {formData.reason}</p>
              </div>
            </div>
            <Button onClick={() => window.location.reload()} className="bg-lambda-purple hover:bg-lambda-purple/90">
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white">
        <div className="flex items-center gap-4">
          <User className="h-12 w-12" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Request Status Change</h1>
            <p className="text-white/90 mt-1">Submit a request to change your membership status</p>
          </div>
        </div>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Member Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Name</Label>
              <p className="text-lg font-semibold">{currentMember.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Member ID</Label>
              <p className="text-lg font-mono">{currentMember.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Current Status</Label>
              <Badge className="bg-green-100 text-green-800">
                {currentMember.currentStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>Status Change Request</CardTitle>
          <CardDescription>
            Please provide detailed information about your status change request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Selection */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Requested Status</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.requestedStatus === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInputChange('requestedStatus', option.value)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{option.label}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {formData.requestedStatus && (
            <>
              {/* Reason Category */}
              <div className="space-y-2">
                <Label htmlFor="reasonCategory">Reason Category *</Label>
                <Select value={formData.reasonCategory} onValueChange={(value) => handleInputChange('reasonCategory', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason category" />
                  </SelectTrigger>
                  <SelectContent>
                    {reasonCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Detailed Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Detailed Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a detailed explanation for your status change request..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="effectiveDate">Effective Date *</Label>
                  <Input
                    id="effectiveDate"
                    type="date"
                    value={formData.effectiveDate}
                    onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
                  />
                </div>
                
                {formData.requestedStatus === 'inactive' && (
                  <div className="space-y-2">
                    <Label htmlFor="returnDate">Expected Return Date</Label>
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Expected Duration */}
              {formData.requestedStatus === 'inactive' && (
                <div className="space-y-2">
                  <Label htmlFor="expectedDuration">Expected Duration</Label>
                  <Select value={formData.expectedDuration} onValueChange={(value) => handleInputChange('expectedDuration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select expected duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1_month">1 Month</SelectItem>
                      <SelectItem value="3_months">3 Months</SelectItem>
                      <SelectItem value="6_months">6 Months</SelectItem>
                      <SelectItem value="1_year">1 Year</SelectItem>
                      <SelectItem value="indefinite">Indefinite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Supporting Documents */}
              <div className="space-y-4">
                <Label>Supporting Documents (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload any supporting documents (medical certificates, etc.)
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload').click()}
                  >
                    Choose Files
                  </Button>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files</Label>
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  placeholder="Any additional information you'd like to provide..."
                  value={formData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                />
              </div>

              {/* Important Information */}
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Important:</strong> Your request will be reviewed by an administrator. 
                  You will receive an email notification once your request has been approved or rejected. 
                  Status changes typically take 1-3 business days to process.
                </AlertDescription>
              </Alert>

              {/* Error Message */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={submitRequest}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting Request...
                    </div>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Request
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}