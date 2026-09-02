import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, Clock, DollarSign, User, XCircle } from 'lucide-react';

interface WithdrawalManagementProps {
  onStatsUpdate: () => void;
}

export const WithdrawalManagement: React.FC<WithdrawalManagementProps> = ({ onStatsUpdate }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const data = await api.get('/withdrawals');
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (withdrawalId: string, status: 'completed' | 'rejected') => {
    if (processingId) return;

    setProcessingId(withdrawalId);
    try {
      await api.put(`/withdrawals/${withdrawalId}`, { status });
      await fetchWithdrawals();
      onStatsUpdate();
    } catch (error: any) {
      console.error('Error updating withdrawal:', error);
      alert('Error updating withdrawal: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
        );
      case 'completed':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Withdrawal Management</h2>
        <div className="bg-yellow-50 px-3 py-1 rounded-full">
          <span className="text-yellow-700 text-sm font-medium">
            {withdrawals.filter((w: any) => w.status === 'pending').length} pending
          </span>
        </div>
      </div>

      {withdrawals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Withdrawal Requests</h3>
            <p className="text-gray-600">
              Withdrawal requests will appear here when users request payouts.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {withdrawals.map((withdrawal: any) => (
            <Card key={withdrawal._id || withdrawal.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">
                        {withdrawal.userId?.name || 'Unknown User'}
                      </h3>
                    </div>
                    {getStatusBadge(withdrawal.status)}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Email: {withdrawal.userId?.email || 'N/A'}</p>
                    <p>UPI ID: {withdrawal.upiId}</p>
                    <p>Requested: {new Date(withdrawal.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                    {withdrawal.processedAt && (
                      <p>Processed: {new Date(withdrawal.processedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    )}
                  </div>
                </div>
                
                <div className="text-right space-y-3">
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold">
                    ₹{withdrawal.amount.toFixed(2)}
                  </div>
                  
                  {withdrawal.status === 'pending' && (
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(withdrawal.id, 'completed')}
                        icon={CheckCircle}
                        className="w-full"
                        disabled={processingId === withdrawal.id}
                      >
                        {processingId === withdrawal.id ? 'Processing...' : 'Approve & Pay'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (processingId) return;
                          if (confirm('Reject this withdrawal request? The amount will be refunded to user\'s account.')) {
                            handleStatusUpdate(withdrawal.id, 'rejected');
                          }
                        }}
                        icon={XCircle}
                        className="w-full"
                        disabled={processingId === withdrawal.id}
                      >
                        {processingId === withdrawal.id ? 'Processing...' : 'Reject & Refund'}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};