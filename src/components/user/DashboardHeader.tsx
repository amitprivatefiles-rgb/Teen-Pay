import React from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { User, LogOut } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface DashboardHeaderProps {
  user: any;
  onSignOut: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user, onSignOut }) => {
  const { t } = useLanguage();

  return (
    <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 sm:p-3 rounded-full">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              {t('dashboard.welcome', { name: user.name })}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">{t('dashboard.ready')}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="text-right">
            <p className="text-xs sm:text-sm text-gray-500">{t('dashboard.age', { age: user.age })}</p>
            <p className="text-xs sm:text-sm text-gray-500">{t('dashboard.member')}</p>
          </div>
          <Button
            variant="outline"
            onClick={onSignOut}
            icon={LogOut}
            size="sm"
          >
            {t('dashboard.signout')}
          </Button>
        </div>
      </div>
    </Card>
  );
};