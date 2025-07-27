import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Mail, Lock, Shield, Crown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('can_approve_members, is_super_admin')
          .eq('id', user.id)
          .single();

        if (profile?.can_approve_members || profile?.is_super_admin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }
    };
    checkUser();
  }, [navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Check if user has admin privileges
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('can_approve_members, is_super_admin, first_name, last_name')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw new Error('Unable to verify admin privileges');
        }

        if (!profile?.can_approve_members && !profile?.is_super_admin) {
          // User is not an admin
          await supabase.auth.signOut();
          throw new Error('Access denied. Admin privileges required.');
        }

        // Success - user is an admin
        toast({
          title: "Admin Access Granted",
          description: `Welcome back, ${profile.first_name} ${profile.last_name}!`,
        });
        
        navigate('/admin-dashboard');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      setError(error.message || 'An error occurred during admin login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <Crown className="h-6 w-6 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <p className="text-gray-600">Lambda Empire Administrative Access</p>
        </div>

        {/* Admin Login Card */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-purple-600" />
              Admin Login
            </CardTitle>
            <CardDescription className="text-center">
              Sign in with your administrator credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Admin Access Notice */}
            <Alert className="mb-4 border-purple-200 bg-purple-50">
              <Shield className="h-4 w-4 text-purple-600" />
              <AlertDescription className="text-purple-800">
                <strong>Admin Access Required:</strong> Only authorized administrators can access this portal.
              </AlertDescription>
            </Alert>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@lambdaempire.org"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your admin password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Verifying Admin Access...' : 'Sign In as Administrator'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Navigation Links */}
        <div className="text-center space-y-2">
          <Link 
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Member Login
          </Link>
          
          <div className="text-xs text-gray-500">
            Need admin access? Contact your Super Administrator
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2024 Lambda Empire Management System</p>
        </div>
      </div>
    </div>
  );
}