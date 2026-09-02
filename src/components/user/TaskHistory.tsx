import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../ui/Card';
import { Calendar, IndianRupee, Star } from 'lucide-react';

interface TaskHistoryProps {
  history: any[];
}

export const TaskHistory: React.FC<TaskHistoryProps> = ({ history }) => {
  const { t } = useLanguage();

  if (history.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('history.none')}</h3>
          <p className="text-gray-600">
            {t('history.first')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('history.title')}</h2>
        <div className="bg-green-50 px-3 py-1 rounded-full">
          <span className="text-green-700 text-sm font-medium">{t('history.completed', { count: history.length })}</span>
        </div>
      </div>

      <div className="space-y-4">
        {history.map((completion) => (
          <Card key={completion._id || completion.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {completion.taskId?.title || 'Unknown Task'}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(completion.submittedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{t('history.approved')}</span>
                  </div>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                +₹{completion.taskId?.rewardAmount || 0}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};