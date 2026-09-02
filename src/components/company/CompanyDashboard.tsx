import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Building, LogOut, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { CompanyTaskManager } from './CompanyTaskManager';
import { CompanyTaskProgress } from './CompanyTaskProgress';

interface CompanyDashboardProps {}

export const CompanyDashboard: React.FC<CompanyDashboardProps> = () => {
  const [companyUser, setCompanyUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    pendingSubmissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyUser();
  }, []);

  useEffect(() => {
    if (companyUser) {
      loadStats();
    }
  }, [companyUser]);

  const loadCompanyUser = async () => {
    try {
      

      if (!user) {
        window.location.href = '/company/login';
        return;
      }

      const companyUsers = await api.get('/company-users?authUserId=' + user.id);
      const companyUserData = companyUsers?.[0];
if (!companyUserData) {
        signOut();
        window.location.href = '/company/login';
        return;
      }

      setCompanyUser(companyUserData);
    } catch (err) {
      console.error('Error loading company user:', err);
      window.location.href = '/company/login';
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (!companyUser) return;

    try {
      console.log('[CompanyDashboard] Loading stats for company:', companyUser.companyId);

      const tasks = await api.get(`/tasks?companyId=${companyUser.companyId}`);
      console.log('[CompanyDashboard] Tasks:', tasks);

      const allSubmissions = await api.get(`/submissions?companyId=${companyUser.companyId}`);
      console.log('[CompanyDashboard] All submissions:', allSubmissions);

      // Count pending/under_review submissions
      const pendingCount = allSubmissions?.filter(
        s => s.status === 'pending' || s.status === 'under_review'
      ).length || 0;

      console.log('[CompanyDashboard] Pending count:', pendingCount);

      setStats({
        totalTasks: tasks?.length || 0,
        activeTasks: tasks?.filter(t => t.active && !t.completed).length || 0,
        completedTasks: tasks?.filter(t => t.completed).length || 0,
        pendingSubmissions: pendingCount,
      });
    } catch (err) {
      console.error('[CompanyDashboard] Error loading stats:', err);
    }
  };

  const handleSignOut = async () => {
    signOut();
    window.location.href = '/company/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!companyUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                {companyUser.companyId.logoUrl ? (
                  <img
                    src={companyUser.companyId.logoUrl}
                    alt={companyUser.companyId.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Building className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{companyUser.companyId.name}</h1>
                <p className="text-sm text-gray-600">{companyUser.name}</p>
              </div>
            </div>
            <Button onClick={handleSignOut} variant="outline" icon={LogOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTasks}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeTasks}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-700 mt-2">{stats.completedTasks}</p>
              </div>
              <div className="bg-gray-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.pendingSubmissions}</p>
              </div>
              <div className="bg-orange-100 rounded-full p-3">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <CompanyTaskManager companyUser={companyUser} onUpdate={loadStats} />
          <CompanyTaskProgress companyUser={companyUser} />
        </div>
      </main>
    </div>
  );
};
