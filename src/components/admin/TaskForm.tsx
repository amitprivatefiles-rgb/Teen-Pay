import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Plus, X } from 'lucide-react';

interface Company {
  id: string;
  name: string;
}

interface TaskFormProps {
  onTaskCreated: () => void;
  onCancel: () => void;
}

const PLATFORMS = [
  { value: 'google', label: 'Google Reviews' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'playstore', label: 'Play Store' },
  { value: 'voting', label: 'Voting (Reality Shows)' },
];

const TASK_TYPES: Record<string, { value: string; label: string }[]> = {
  google: [{ value: 'review', label: 'Review' }],
  instagram: [
    { value: 'comment', label: 'Comment on Post' },
    { value: 'like', label: 'Like Post' },
    { value: 'follow', label: 'Follow Account' },
  ],
  youtube: [
    { value: 'comment', label: 'Comment on Video' },
    { value: 'like', label: 'Like Video' },
    { value: 'subscribe', label: 'Subscribe to Channel' },
  ],
  playstore: [{ value: 'install_review', label: 'Install & Review App' }],
  voting: [{ value: 'vote', label: 'Vote for Contestant' }],
};

export const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    platform: 'google',
    taskType: 'review',
    taskLink: '',
    googleProfileLink: '',
    reviewText: '',
    starRating: 5,
    rewardAmount: 10,
    maxUsers: 50,
    shareable: false,
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await api.get('/companies'); const error = null;
setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const needsReviewFields = formData.platform === 'google' || formData.platform === 'playstore' || formData.taskType === 'comment';
      const needsStarRating = formData.platform === 'google' || formData.platform === 'playstore';

      const taskData: any = {
        title: formData.title,
        companyId: formData.companyId,
        platform: formData.platform,
        taskType: formData.taskType,
        taskLink: formData.taskLink,
        googleProfileLink: formData.taskLink,
        rewardAmount: parseFloat(formData.rewardAmount.toString()),
        maxUsers: formData.maxUsers,
        active: true,
        completed: false,
        shareable: formData.shareable,
      };

      if (needsReviewFields && formData.reviewText) {
        taskData.reviewText = formData.reviewText;
      }

      if (needsStarRating) {
        taskData.starRating = formData.starRating;
      }

      await api.post('/tasks', taskData);

      onTaskCreated();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'starRating' || name === 'maxUsers' ? parseInt(value) : value
    }));
  };

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const platform = e.target.value;
    const defaultTaskType = TASK_TYPES[platform]?.[0]?.value || 'review';
    setFormData(prev => ({
      ...prev,
      platform,
      taskType: defaultTaskType,
      shareable: platform === 'voting' ? true : prev.shareable,
    }));
  };

  const needsReviewFields = formData.platform === 'google' || formData.platform === 'playstore' || formData.taskType === 'comment' || formData.platform === 'voting';
  const needsStarRating = formData.platform === 'google' || formData.platform === 'playstore';

  const getTaskLinkPlaceholder = () => {
    switch (formData.platform) {
      case 'google':
        return 'https://maps.google.com/...';
      case 'instagram':
        return 'https://www.instagram.com/...';
      case 'youtube':
        return 'https://www.youtube.com/...';
      case 'playstore':
        return 'https://play.google.com/store/apps/...';
      case 'voting':
        return 'https://www.jiocinema.com/bigg-boss/vote/...';
      default:
        return 'Enter the task link';
    }
  };

  const getTaskLinkLabel = () => {
    switch (formData.platform) {
      case 'google':
        return 'Google Business Profile Link';
      case 'instagram':
        return formData.taskType === 'follow' ? 'Instagram Profile Link' : 'Instagram Post Link';
      case 'youtube':
        return formData.taskType === 'subscribe' ? 'YouTube Channel Link' : 'YouTube Video Link';
      case 'playstore':
        return 'Play Store App Link';
      case 'voting':
        return 'Voting Page Link';
      default:
        return 'Task Link';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
        <Button
          variant="ghost"
          onClick={onCancel}
          icon={X}
          className="text-gray-500 hover:text-gray-700"
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Title
          </label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Review our Google Business Profile"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a company</option>
            {companies.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              name="platform"
              value={formData.platform}
              onChange={handlePlatformChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {PLATFORMS.map((platform) => (
                <option key={platform.value} value={platform.value}>
                  {platform.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Type
            </label>
            <select
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {TASK_TYPES[formData.platform]?.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {getTaskLinkLabel()}
          </label>
          <Input
            name="taskLink"
            value={formData.taskLink}
            onChange={handleChange}
            placeholder={getTaskLinkPlaceholder()}
            required
          />
        </div>

        {needsReviewFields && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {formData.taskType === 'comment' ? 'Comment Text' : formData.platform === 'voting' ? 'Voting Instructions' : 'Review Text'}
            </label>
            <textarea
              name="reviewText"
              value={formData.reviewText}
              onChange={handleChange}
              placeholder={formData.taskType === 'comment' ? 'Enter the comment users should post...' : formData.platform === 'voting' ? 'E.g., Vote for Contestant X in Big Boss Season 18...' : 'Enter the review text users should post...'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {needsStarRating && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Star Rating
              </label>
              <Input
                type="number"
                name="starRating"
                value={formData.starRating}
                onChange={handleChange}
                min="1"
                max="5"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reward Amount (₹)
            </label>
            <Input
              type="number"
              name="rewardAmount"
              value={formData.rewardAmount}
              onChange={handleChange}
              min="1"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Users
            </label>
            <Input
              type="number"
              name="maxUsers"
              value={formData.maxUsers}
              onChange={handleChange}
              min="1"
              max="1000000"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum number of users who can claim this task
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <input
            type="checkbox"
            id="shareable"
            checked={formData.shareable}
            onChange={(e) => setFormData(prev => ({ ...prev, shareable: e.target.checked }))}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
          />
          <div>
            <label htmlFor="shareable" className="text-sm font-medium text-purple-800 cursor-pointer">
              Enable Shareable Link
            </label>
            <p className="text-xs text-purple-600">Allow anyone to complete this task via a direct link without logging in</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Important Notice:</h4>
          <p className="text-sm text-blue-700">
            Users must complete the task as specified and provide valid proof. Submissions that don't meet requirements will be rejected.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            icon={Plus}
            className="flex-1"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};