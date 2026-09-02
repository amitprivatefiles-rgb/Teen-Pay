import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TaskCard } from './TaskCard';
import { Star, Users, IndianRupee } from 'lucide-react';

interface TaskListProps {
  tasks: any[];
  onTaskComplete: (taskId: string) => void;
  taskSubmissions: any[];
  loading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete, taskSubmissions, loading }) => {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Star className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('notasks.title')}</h3>
          <p className="text-gray-600 mb-6">
            {t('notasks.description')}
          </p>
          <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
            {t('notasks.tip')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('nav.available')}</h2>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-blue-700 text-sm font-medium">{t('companies.available', { count: tasks.length })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => {
          const userSubmission = taskSubmissions.find(sub => sub.taskId === task.id);
          return (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => onTaskComplete(task.id)}
              userSubmission={userSubmission}
            />
          );
        })}
      </div>
    </div>
  );
};