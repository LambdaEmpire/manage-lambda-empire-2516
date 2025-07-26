import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Crown, 
  Mail, 
  User, 
  Phone, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const adminRoles = [
  { 
    value: 'national_president', 
    label: 'National President', 
    level: 'national', 
    description: 'Highest level of authority across all chapters',
    color: 'bg-red-100 text-red-800'
  },
  { 
    value: 'national_vp', 
    label: 'National Vice President', 
    level: 'national', 
    description: 'Second highest national authority',
    color: 'bg-red-100 text-red-800'
  },
  { 
    value: 'national_secretary', 
    label: 'National Secretary', 
    level: 'national', 
    description: 'National administrative oversight',
    color: 'bg-red-100 text-red-800'
  },
  { 
    value: 'national_treasurer', 
    label: 'National Treasurer', 
    level: 'national', 
    description: 'National financial management',
    color: 'bg-red-100 text-red-800'
  },
  { 
    value: 'regional_director', 
    label: 'Regional Director', 
    level: 'regional', 
    description: 'Oversees multiple chapters in a region',
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    value: 'regional_coordinator', 
    label: 'Regional Coordinator', 
    level: 'regional', 
    description: 'Assists regional director with coordination',
    color: 'bg-blue-100 text-blue-800'
  },
  { 
    value: 'chapter_president', 
    label: 'Chapter President', 
    level: 'chapter', 
    description: 'Leads individual chapter operations',
    color: 'bg-green-100 text-green-800'
  },
  { 
    value: 'chapter_vp', 
    label: 'Chapter Vice President', 
    level: 'chapter', 
    description: 'Assists chapter president',
    color: 'bg-green-100 text-green-800'
  },
  { 
    value: 'chapter_secretary', 
    label: 'Chapter Secretary', 
    level: 'chapter', 
    description: 'Chapter administrative duties',
    color: 'bg-green-100 text-green-800'
  },
  { 
    value: 'chapter_treasurer', 
    label: 'Chapter Treasurer', 
    level: 'chapter', 
    description: 'Chapter financial management',
    color: 'bg-green-100 text-green-800'
  }
];

const regions = [
  'Northeast', 'Southeast', 'Midwest', 'Southwest', 'West', 'Northwest'
];

const states = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function AdminCreation() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    chapter: '',
    region: '',
    city: '',
    state: '',
    genderAffiliation: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [createdAdmin, setCreatedAdmin] = useState(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      setError('Please fill in all required fields');
      return false;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }

    const selectedRole = adminRoles.find(role => role.value === formData.role);
    if (selectedRole?.level === 'regional' && !formData.region) {
      setError('Region is required for regional roles');
      return false;
    }

    if (selectedRole?.level === 'chapter' && (!formData.chapter || !formData.region)) {
      setError('Chapter and region are required for chapter roles');
      return false;
    }

    return true;
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to create admin
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedRole = adminRoles.find(role => role.value === formData.role);
      const newAdmin = {
        ...formData,
        id: `LEM${Date.now()}`,
        role: selectedRole,
        createdAt: new Date().toISOString(),
        status: 'active',
        tempPassword: `temp${Math.random().toString(36).slice(-8)}`
      };

      console.log('Creating Admin:', newAdmin);
      setCreatedAdmin(newAdmin);
      setSuccess(true);

    } catch (err) {
      setError('Failed to create admin account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      chapter: '',
      region: '',
      city: '',
      state: '',
      genderAffiliation: ''
    });
    setSuccess(false);
    setCreatedAdmin(null);
    setError('');
  };

  const selectedRole = adminRoles.find(role => role.value === formData.role);

  if (success && createdAdmin) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Admin Created Successfully!</h1>
                <p className="text-white/90 mt-1">New administrator account has been set up</p>
              </div>
            </div>
            <Button 
              onClick={resetForm}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create Another
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Admin Account Details</CardTitle>
            <CardDescription>
              Please share these credentials with the new administrator
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  <p className="text-lg font-semibold">{createdAdmin.firstName} {createdAdmin.lastName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                  <p className="text-lg">{createdAdmin.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Member ID</Label>
                  <p className="text-lg font-mono">{createdAdmin.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Role</Label>
                  <div className="flex items-center gap-2">
                    <Badge className={createdAdmin.role.color}>
                      {createdAdmin.role.label}
                    </Badge>
                    <span className="text-sm text-gray-500">({createdAdmin.role.level})</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {createdAdmin.chapter && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Chapter</Label>
                    <p className="text-lg">{createdAdmin.chapter}</p>
                  </div>
                )}
                {createdAdmin.region && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Region</Label>
                    <p className="text-lg">{createdAdmin.region}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Temporary Password</Label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="font-mono text-lg">{createdAdmin.tempPassword}</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      The admin must change this password on first login
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                <strong>Important:</strong> Please securely share these credentials with the new administrator. 
                They will be required to change their password upon first login.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button onClick={resetForm} className="bg-lambda-purple hover:bg-lambda-purple/90">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Another Admin
              </Button>
              <Link to="/admin/members">
                <Button variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  View All Members
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-lambda-purple to-blue-600 p-6 rounded-xl text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <UserPlus className="h-12 w-12" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Create New Administrator</h1>
              <p className="text-white/90 mt-1">Add a new admin account with role-based permissions</p>
            </div>
          </div>
          <Link to="/admin/members">
            <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Members
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrator Information</CardTitle>
          <CardDescription>
            Fill in the details for the new administrator account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateAdmin} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@lambdaempire.org"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Administrative Role</h3>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Administrator Role <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select administrative role" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={role.color} variant="secondary">
                            {role.level}
                          </Badge>
                          <span>{role.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRole && (
                  <p className="text-sm text-gray-600">{selectedRole.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="genderAffiliation" className="text-sm font-medium text-gray-700">
                  Gender Affiliation
                </Label>
                <Select value={formData.genderAffiliation} onValueChange={(value) => handleInputChange('genderAffiliation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select affiliation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fraternity">Fraternity</SelectItem>
                    <SelectItem value="Sorority">Sorority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Location & Assignment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(selectedRole?.level === 'chapter' || selectedRole?.level === 'regional') && (
                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-sm font-medium text-gray-700">
                      Region {(selectedRole?.level === 'regional' || selectedRole?.level === 'chapter') && <span className="text-red-500">*</span>}
                    </Label>
                    <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedRole?.level === 'chapter' && (
                  <div className="space-y-2">
                    <Label htmlFor="chapter" className="text-sm font-medium text-gray-700">
                      Chapter <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="chapter"
                      type="text"
                      placeholder="Alpha Chapter"
                      value={formData.chapter}
                      onChange={(e) => handleInputChange('chapter', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="city"
                      type="text"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Create Button */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-lambda-purple hover:bg-lambda-purple/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Administrator...
                  </div>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Administrator
                  </>
                )}
              </Button>
              
              <Link to="/admin/members">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}