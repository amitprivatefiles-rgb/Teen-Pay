import React from 'react';
import { Card } from '../ui/Card';
import { Users, Star, TrendingUp, DollarSign } from 'lucide-react';

interface AdminStatsProps {
  stats: {
    totalUsers: number;
    totalTasks: number;
    totalEarnings: number;
    pendingWithdrawals: number;
  };
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Platform Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium mb-1">Total Users</p>
              <p className="text-3xl font-bold text-blue-800">{stats.totalUsers}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 text-sm font-medium mb-1">Total Tasks</p>
              <p className="text-3xl font-bold text-purple-800">{stats.totalTasks}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-full">
              <Star className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-700 text-sm font-medium mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-green-800">₹{stats.totalEarnings.toFixed(2)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-700 text-sm font-medium mb-1">Pending Withdrawals</p>
              <p className="text-3xl font-bold text-orange-800">₹{stats.pendingWithdrawals.toFixed(2)}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.totalTasks}</p>
            <p className="text-gray-600">Available Tasks</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              ₹{(stats.totalEarnings / (stats.totalUsers || 1)).toFixed(2)}
            </p>
            <p className="text-gray-600">Avg. Earnings per User</p>
          </div>
        </div>
      </Card>
    </div>
  );
};