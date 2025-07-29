import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Crown, Shield, ArrowLeft, User } from 'lucide-react';

export default function SuperAdminSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isFirstSuperAdmin, setIsFirstSuperAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for existing session and super admin status
  useEffect(() => {
    let mounted = true;
    
    const checkStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && mounted) {
          navigate('/admin-dashboard');
          return;
        }

        // Check if this is the first super admin setup
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_super_admin', true)
          .limit(1);

        if (mounted) {
          setIsFirstSuperAdmin(!existingProfiles || existingProfiles.length === 0);
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    checkStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && mounted) {
        navigate('/admin-dashboard');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSuperAdminSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      if (isFirstSuperAdmin) {
        // Create first super admin with auto-approval
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              is_super_admin: true,
              can_approve_members: true
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Auto-login the first super admin
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) throw signInError;

          toast({
            title: "Super Admin Created!",
            description: "First super admin account created and logged in.",
          });
          navigate('/admin-dashboard');
        }
      } else {
        // Regular super admin login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Verify super admin privileges
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_super_admin, can_approve_members, first_name, last_name')
            .eq('id', data.user.id)
            .single();

          if (!profile?.is_super_admin && !profile?.can_approve_members) {
            await supabase.auth.signOut();
            throw new Error('Super admin privileges required');
          }

          toast({
            title: "Super Admin Access",
            description: `Welcome, ${profile.first_name} ${profile.last_name}!`,
          });
          navigate('/admin-dashboard');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Super admin setup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Crown className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Super Admin
            </h1>
          </div>
          <p className="text-gray-600">
            {isFirstSuperAdmin ? 'Initial Setup' : 'Access Portal'}
          </p>
        </div>

        {/* Super Admin Setup Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center">
              {isFirstSuperAdmin ? 'Create Super Admin' : 'Super Admin Login'}
            </CardTitle>
            <CardDescription className="text-center">
              {isFirstSuperAdmin 
                ? 'Set up the first super administrator account' 
                : 'Sign in with super admin credentials'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="mb-4 border-purple-200 bg-purple-50">
              <Crown className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Super Admin:</strong> {isFirstSuperAdmin 
                  ? 'First super admin will be auto-approved' 
                  : 'Highest level administrative access'
                }
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSuperAdminSetup} className="space-y-4">
              {isFirstSuperAdmin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="superadmin@lambdaempire.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {isFirstSuperAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={isFirstSuperAdmin ? "Create password" : "Enter password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600" 
                disabled={isLoading}
              >
                {isLoading 
                  ? 'Processing...' 
                  : isFirstSuperAdmin 
                    ? 'Create Super Admin' 
                    : 'Super Admin Sign In'
                }
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => navigate('/login')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Member Login
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Lambda Empire Management System</p>
        </div>
      </div>
    </div>
  );
}