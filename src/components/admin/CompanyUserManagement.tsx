import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Trash2, UserPlus } from 'lucide-react';

interface CompanyUserManagementProps {
  onStatsUpdate: () => void;
}

export const CompanyUserManagement: React.FC<CompanyUserManagementProps> = ({ onStatsUpdate }) => {
  const [companyUsers, setCompanyUsers] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    companyId: '',
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [companiesRes, companyUsersRes] = await Promise.all([
        api.get('/companies'),
        api.get('/company-users'),
      ]);

      setCompanies(companiesRes || []);
      setCompanyUsers(companyUsersRes || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/company-users', {
        companyId: formData.companyId,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setFormData({
        companyId: '',
        name: '',
        email: '',
        password: '',
      });
      setShowForm(false);
      loadData();
      onStatsUpdate();
      alert('Company user created successfully!');
    } catch (err: any) {
      console.error('Error creating company user:', err);
      alert('Error creating company user: ' + err.message);
    }
  };

  const handleDelete = async (companyUser: any) => {
    if (!confirm(`Are you sure you want to delete ${companyUser.name}?`)) return;

    try {
      await api.delete(`/company-users/${companyUser._id || companyUser.id}`);
      loadData();
      onStatsUpdate();
    } catch (err: any) {
      console.error('Error deleting company user:', err);
      alert('Error deleting company user: ' + err.message);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Company User Management</h2>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Add Company User
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Create Company User Account</h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setFormData({ companyId: '', name: '', email: '', password: '' });
              }}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Company
              </label>
              <select
                value={formData.companyId}
                onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a company</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter user name"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="user@company.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Enter password (min 6 characters)"
              required
              minLength={6}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" icon={UserPlus}>
                Create Company User
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ companyId: '', name: '', email: '', password: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {companyUsers.map((companyUser) => (
          <Card key={companyUser._id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{companyUser.name}</h3>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {companyUser.companyId?.name}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>Email: {companyUser.email}</p>
                  <p className="text-xs text-gray-500">
                    Created: {new Date(companyUser.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              </div>

              <Button
                size="sm"
                variant="danger"
                onClick={() => handleDelete(companyUser)}
                icon={Trash2}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}

        {companyUsers.length === 0 && (
          <Card className="p-12 text-center">
            <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Company Users Yet</h3>
            <p className="text-gray-600 mb-6">
              Create company user accounts to allow companies to manage their tasks
            </p>
            <Button onClick={() => setShowForm(true)} icon={Plus}>
              Add First Company User
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};
