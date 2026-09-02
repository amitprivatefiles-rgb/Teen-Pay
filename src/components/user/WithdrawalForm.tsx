import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { api } from '../../lib/api';
import { IndianRupee, AlertCircle, CheckCircle } from 'lucide-react';

interface WithdrawalFormProps {
  userProfile: any;
  minAmount: number;
  onWithdrawalSuccess?: () => void;
}

export const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ userProfile, minAmount, onWithdrawalSuccess }) => {
  const { t } = useLanguage();
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const canWithdraw = userProfile.totalEarnings >= minAmount;
  const maxWithdrawal = userProfile.totalEarnings;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const withdrawalAmount = parseFloat(amount);

    if (withdrawalAmount < minAmount) {
      setError(t('withdraw.min').replace('•', '').trim() + `: ₹${minAmount}`);
      setLoading(false);
      return;
    }

    if (withdrawalAmount > maxWithdrawal) {
      setError(`You can't withdraw more than your available balance of ₹${maxWithdrawal}`);
      setLoading(false);
      return;
    }

    if (!upiId.includes('@')) {
      setError('Please enter a valid UPI ID');
      setLoading(false);
      return;
    }

    try {
      // Create withdrawal request
      await api.post('/withdrawals', {
        userId: userProfile._id || userProfile.id,
        amount: withdrawalAmount,
        upiId: upiId,
        status: 'pending',
      });

      // Update user balance
      const balanceError = null; /* handled by backend */

      if (balanceError) throw balanceError;

      setSuccess(true);
      setUpiId('');
      setAmount('');

      if (onWithdrawalSuccess) {
        onWithdrawalSuccess();
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('withdraw.success')}</h3>
        <p className="text-gray-600 mb-6">
          {t('withdraw.success_msg')}
        </p>
        <Button type="button" onClick={() => setSuccess(false)}>
          {t('withdraw.another')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('withdraw.title')}</h2>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-blue-700 text-sm font-medium">{t('withdraw.available', { amount: maxWithdrawal.toFixed(2) })}</span>
        </div>
      </div>

      <Card className="p-6">
        {!canWithdraw ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <AlertCircle className="w-16 h-16 text-yellow-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('withdraw.minimum')}</h3>
            <p className="text-gray-600 mb-4">
              {t('withdraw.need_amount', { min: minAmount, current: userProfile.totalEarnings.toFixed(2) })}
            </p>
            <p className="text-blue-600 bg-blue-50 p-3 rounded-lg">
              {t('withdraw.keep_earning', { need: (minAmount - userProfile.totalEarnings).toFixed(2) })}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-xl">
              <h4 className="font-medium text-blue-900 mb-2">{t('withdraw.info')}</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>{t('withdraw.min', { min: minAmount })}</li>
                <li>{t('withdraw.processing')}</li>
                <li>{t('withdraw.balance', { balance: maxWithdrawal.toFixed(2) })}</li>
                <li>{t('withdraw.fees')}</li>
              </ul>
            </div>

            <Input
              label={t('withdraw.upi')}
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@paytm, yourname@gpay, etc."
              icon={<IndianRupee className="w-4 h-4" />}
            />

            <Input
              label={t('withdraw.amount')}
              type="number"
              required
              min={minAmount}
              max={maxWithdrawal}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t('withdraw.amount_placeholder', { min: minAmount })}
              icon={<IndianRupee className="w-4 h-4" />}
            />

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="lg"
            >
              {t('withdraw.request')}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};