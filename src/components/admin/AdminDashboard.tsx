import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { AdminHeader } from './AdminHeader';
import { TaskManagement } from './TaskManagement';
import { UserManagement } from './UserManagement';
import { WithdrawalManagement } from './WithdrawalManagement';
import { AdminStats } from './AdminStats';
import { Plus, Users, DollarSign, Settings } from 'lucide-react';
import { TaskSubmissionManagement } from './TaskSubmissionManagement';
import { CompanyManagement } from './CompanyManagement';
import { CompanyUserManagement } from './CompanyUserManagement';
import { CheckSquare } from 'lucide-react';
import { GuestSubmissionManagement } from './GuestSubmissionManagement';

export const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'companies' | 'company-users' | 'tasks' | 'submissions' | 'guest-submissions' | 'users' | 'withdrawals'>('stats');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTasks: 0,
    totalEarnings: 0,
    pendingWithdrawals: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats({
        totalUsers: response.totalUsers || 0,
        totalTasks: response.totalTasks || 0,
        totalEarnings: response.totalEarnings || 0,
        pendingWithdrawals: response.pendingWithdrawals || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminHeader onSignOut={signOut} />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={activeTab === 'stats' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('stats')}
          icon={Settings}
        >
          Overview
        </Button>
       <Button
         variant={activeTab === 'companies' ? 'primary' : 'ghost'}
         onClick={() => setActiveTab('companies')}
         icon={Settings}
       >
         Companies
       </Button>
       <Button
         variant={activeTab === 'company-users' ? 'primary' : 'ghost'}
         onClick={() => setActiveTab('company-users')}
         icon={Users}
       >
         Company Users
       </Button>
        <Button
          variant={activeTab === 'tasks' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('tasks')}
          icon={Plus}
        >
          Manage Tasks
        </Button>
        <Button
          variant={activeTab === 'submissions' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('submissions')}
          icon={CheckSquare}
        >
          Review Submissions
        </Button>
        <Button
          variant={activeTab === 'guest-submissions' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('guest-submissions')}
          icon={CheckSquare}
        >
          Guest Submissions
        </Button>
        <Button
          variant={activeTab === 'users' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('users')}
          icon={Users}
        >
          Manage Users
        </Button>
        <Button
          variant={activeTab === 'withdrawals' ? 'primary' : 'ghost'}
          onClick={() => setActiveTab('withdrawals')}
          icon={DollarSign}
        >
          Withdrawals
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && <AdminStats stats={stats} />}
     {activeTab === 'companies' && <CompanyManagement onStatsUpdate={fetchStats} />}
     {activeTab === 'company-users' && <CompanyUserManagement onStatsUpdate={fetchStats} />}
      {activeTab === 'tasks' && <TaskManagement onStatsUpdate={fetchStats} />}
      {activeTab === 'submissions' && <TaskSubmissionManagement onStatsUpdate={fetchStats} />}
      {activeTab === 'guest-submissions' && <GuestSubmissionManagement onStatsUpdate={fetchStats} />}
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'withdrawals' && <WithdrawalManagement onStatsUpdate={fetchStats} />}
    </div>
  );
};