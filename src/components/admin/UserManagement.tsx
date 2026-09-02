import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Users, Calendar, DollarSign, Ban, CheckCircle } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suspendingUser, setSuspendingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.get('/users');
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string, suspend: boolean) => {
    let reason = null;
    if (suspend) {
      reason = prompt('Enter suspension reason:');
      if (!reason?.trim()) {
        alert('Please provide a reason for suspension.');
        return;
      }
    }

    setSuspendingUser(userId);
    try {
      const updateData = suspend 
        ? {
            suspended: true,
            suspensionReason: reason?.trim()
          }
        : {
            suspended: false
          };

      await api.put(`/users/${userId}/suspend`, updateData);
      
      fetchUsers();
      alert(suspend ? 'User suspended successfully' : 'User unsuspended successfully');
    } catch (error: any) {
      console.error('Error updating user suspension:', error);
      alert('Error: ' + error.message);
    } finally {
      setSuspendingUser(null);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-blue-700 text-sm font-medium">{users.length} total users</span>
        </div>
      </div>

      {users.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Users Yet</h3>
            <p className="text-gray-600">
              Users will appear here once they sign up for the platform.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {users.map((user: any) => (
            <Card key={user._id || user.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Age {user.age}
                      </span>
                      {user.suspended && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                          <Ban className="w-3 h-3" />
                          <span>Suspended</span>
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <span>{user.email}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                  
                  {user.suspended && user.suspensionReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                      <p className="text-red-800">
                        <strong>Suspension Reason:</strong> {user.suspensionReason}
                      </p>
                      {user.suspendedAt && (
                        <p className="text-red-600 text-xs mt-1">
                          Suspended on: {new Date(user.suspendedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-right space-y-3">
                  <div>
                    <div className="flex items-center space-x-1 text-green-600 font-medium">
                      <DollarSign className="w-4 h-4" />
                      <span>₹{user.totalEarnings?.toFixed(2) || '0.00'}</span>
                    </div>
                    <p className="text-xs text-gray-500">Total Earnings</p>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {user.suspended ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuspendUser(user._id || user.id, false)}
                        loading={suspendingUser === (user._id || user.id)}
                        icon={CheckCircle}
                        className="text-green-600 border-green-300 hover:bg-green-50"
                      >
                        Unsuspend
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleSuspendUser(user._id || user.id, true)}
                        loading={suspendingUser === (user._id || user.id)}
                        icon={Ban}
                      >
                        Suspend
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};