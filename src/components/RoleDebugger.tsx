import React, { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useOptimizedAuth } from '@/hooks/useOptimizedAuth';
import { supabase } from '@/lib/supabase';

export const RoleDebugger: React.FC = () => {
  const { user, isAuthenticated } = useOptimizedAuth();
  const { role, loading, isAdmin, isSuperAdmin } = useUserRole();
  const [testResult, setTestResult] = useState<string>('');

  const testRoleFetch = async () => {
    if (!user?.id) {
      setTestResult('No user ID');
      return;
    }

    try {
      console.log('Manual test: Fetching role for', user.id);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('Manual test result:', { data, error });
      setTestResult(`Data: ${JSON.stringify(data)}, Error: ${JSON.stringify(error)}`);
    } catch (err) {
      console.error('Manual test error:', err);
      setTestResult(`Exception: ${err}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs z-50 max-w-sm">
      <div className="font-bold mb-2">Debug Info:</div>
      <div>User ID: {user?.id?.substring(0, 8) || 'None'}</div>
      <div>Email: {user?.email || 'None'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>Role: {loading ? 'Loading...' : role || 'None'}</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>Is Admin: {isAdmin() ? 'Yes' : 'No'}</div>
      <div>Is Super Admin: {isSuperAdmin() ? 'Yes' : 'No'}</div>
      
      <button 
        onClick={testRoleFetch}
        className="mt-2 bg-blue-600 text-white px-2 py-1 rounded text-xs"
      >
        Test Role Fetch
      </button>
      
      {testResult && (
        <div className="mt-2 text-xs text-yellow-300 break-words">
          Test: {testResult}
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-300">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};