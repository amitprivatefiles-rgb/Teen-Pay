import React from 'react';
import { Card } from '../ui/Card';
import { TrendingUp, IndianRupee, Calendar } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface EarningsCardProps {
  dailyEarnings: number;
  totalEarnings: number;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({ 
  dailyEarnings, 
  totalEarnings 
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
      <Card className="p-3 sm:p-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-700 text-xs sm:text-sm font-medium mb-1 leading-tight">{t('earnings.today')}</p>
            <p className="text-lg sm:text-3xl font-bold text-green-800 flex items-center gap-1">
              <IndianRupee className="w-4 h-4 sm:w-6 sm:h-6" />
              {dailyEarnings.toFixed(2)}
            </p>
            <p className="text-green-600 text-xs sm:text-sm mt-1 hidden sm:block">{t('earnings.keepup')}</p>
          </div>
          <div className="bg-green-500 p-1.5 sm:p-3 rounded-full">
            <Calendar className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-3 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-700 text-xs sm:text-sm font-medium mb-1 leading-tight">{t('earnings.total')}</p>
            <p className="text-lg sm:text-3xl font-bold text-blue-800 flex items-center gap-1">
              <IndianRupee className="w-4 h-4 sm:w-6 sm:h-6" />
              {totalEarnings.toFixed(2)}
            </p>
            <p className="text-blue-600 text-xs sm:text-sm mt-1 hidden sm:block">
              {totalEarnings >= 50 ? t('earnings.withdraw') : t('earnings.need', { amount: (50 - totalEarnings).toFixed(2) })}
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-1.5 sm:p-3 rounded-full">
            <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};