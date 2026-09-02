import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, Edit, Trash2, Building, Eye, EyeOff } from 'lucide-react';

interface CompanyManagementProps {
  onStatsUpdate: () => void;
}

export const CompanyManagement: React.FC<CompanyManagementProps> = ({ onStatsUpdate }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await api.get('/companies');

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCompany) {
        await api.put(`/companies/${editingCompany.id}`, formData);
        if (error) throw error;
      } else {
        await api.post('/companies', { ...formData, active: true });
        if (error) throw error;
      }

      setFormData({
        name: '',
        description: '',
        logoUrl: '',
      });
      setShowForm(false);
      setEditingCompany(null);
      fetchCompanies();
      onStatsUpdate();
    } catch (error) {
      console.error('Error saving company:', error);
      alert('Error saving company: ' + error.message);
    }
  };

  const handleDelete = async (companyId: string) => {
    if (!confirm('Are you sure you want to delete this company? This will also delete all associated tasks.')) return;

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
      fetchCompanies();
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Error deleting company: ' + error.message);
    }
  };

  const handleEdit = (company: any) => {
    setFormData({
      name: company.name,
      description: company.description || '',
      logoUrl: company.logoUrl || '',
    });
    setEditingCompany(company);
    setShowForm(true);
  };

  const toggleActive = async (companyId: string, currentStatus: boolean) => {
    try {
      await api.put(`/companies/${companyId}`, { active: !currentStatus });

      if (error) throw error;
      fetchCompanies();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating company status:', error);
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
        <h2 className="text-2xl font-bold text-gray-900">Company Management</h2>
        <Button 
          icon={Plus}
          onClick={() => setShowForm(true)}
        >
          Add New Company
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingCompany ? 'Edit Company' : 'Add New Company'}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setEditingCompany(null);
                setFormData({ name: '', description: '', logoUrl: '' });
              }}
            >
              Cancel
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter company name"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter company description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <Input
              label="Logo URL (Optional)"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
              placeholder="https://example.com/logo.png"
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {editingCompany ? 'Update Company' : 'Create Company'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingCompany(null);
                  setFormData({ name: '', description: '', logoUrl: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid gap-4">
        {companies.map((company: any) => (
          <Card key={company.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center ${company.logoUrl ? 'hidden' : 'flex'}`}
                >
                  <Building className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{company.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      company.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {company.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  {company.description && (
                    <p className="text-gray-600 text-sm mb-2">{company.description}</p>
                  )}
                  
                  <div className="text-xs text-gray-500">
                    Created: {new Date(company.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toggleActive(company.id, company.active)}
                  icon={company.active ? EyeOff : Eye}
                >
                  {company.active ? 'Deactivate' : 'Activate'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(company)}
                  icon={Edit}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(company.id)}
                  icon={Trash2}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {companies.length === 0 && (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Companies Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first company to start organizing tasks by business.
            </p>
            <Button onClick={() => setShowForm(true)} icon={Plus}>
              Add First Company
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};