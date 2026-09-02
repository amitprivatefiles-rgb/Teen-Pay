import React, { useState } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Building, LogIn } from 'lucide-react';

export const CompanyLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const authData = await api.post('/auth/company-login', { email, password });
      api.setToken(authData.token);
      const authError = null; // shim

      if (authError) throw authError;

      const companyUsers = await api.get('/company-users?authUserId=' + authData.user.id);
      const companyUser = companyUsers?.[0];

      if (!companyUser) {
        
        throw new Error('This account is not registered as a company user.');
      }

      window.location.href = '/company/dashboard';
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Portal</h1>
          <p className="text-gray-600">Sign in to manage your tasks</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="company@example.com"
            required
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            icon={LogIn}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <p>For regular users, <a href="/" className="text-blue-600 hover:text-blue-700 font-medium">click here</a></p>
          </div>
        </form>
      </Card>
    </div>
  );
};
