import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';

interface WithdrawalHistoryProps {
  userId: string;
}

export const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({ userId }) => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithdrawals();

    
    // Removed Supabase subscription
    const subscription = { unsubscribe: () => {} };
    // Polling fallback
    const pollInterval = setInterval(() => {
      fetchData && fetchData();
      fetchWithdrawals && fetchWithdrawals();
    }, 10000);
    

    return () => {
      subscription.unsubscribe();
      clearInterval(pollInterval);
    };
  }, [userId]);

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          badge: (
            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Pending Review</span>
            </span>
          ),
          message: 'Your withdrawal request is being reviewed by admin.'
        };
      case 'completed':
        return {
          badge: (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs flex items-center space-x-1">
              <CheckCircle className="w-3 h-3" />
              <span>Completed</span>
            </span>
          ),
          message: 'Payment has been sent to your UPI ID.'
        };
      case 'rejected':
        return {
          badge: (
            <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs flex items-center space-x-1">
              <XCircle className="w-3 h-3" />
              <span>Rejected</span>
            </span>
          ),
          message: 'Request was rejected. Amount has been refunded to your account.'
        };
      default:
        return { badge: null, message: '' };
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
        <h2 className="text-2xl font-bold text-gray-900">Withdrawal History</h2>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-blue-700 text-sm font-medium">
            {withdrawals.filter(w => w.status === 'pending').length} Pending
          </span>
        </div>
      </div>

      {withdrawals.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Withdrawal Requests</h3>
            <p className="text-gray-600">
              Your withdrawal requests will appear here once you submit them.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {withdrawals.map((withdrawal: any) => {
            const statusDisplay = getStatusDisplay(withdrawal.status);
            return (
              <Card key={withdrawal.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-bold text-lg">
                        ₹{withdrawal.amount.toFixed(2)}
                      </div>
                      {statusDisplay.badge}
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-gray-600">
                        <strong>UPI ID:</strong> {withdrawal.upiId}
                      </p>
                      <p className="text-gray-600">
                        <strong>Requested:</strong> {new Date(withdrawal.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {withdrawal.processedAt && (
                        <p className="text-gray-600">
                          <strong>Processed:</strong> {new Date(withdrawal.processedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                      <p className={`mt-3 p-3 rounded-lg text-sm ${
                        withdrawal.status === 'completed' ? 'bg-green-50 text-green-800' :
                        withdrawal.status === 'rejected' ? 'bg-red-50 text-red-800' :
                        'bg-yellow-50 text-yellow-800'
                      }`}>
                        {statusDisplay.message}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
