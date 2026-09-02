import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../lib/api';
import { Button } from '../ui/Button';
import { Upload, X, AlertCircle } from 'lucide-react';

interface TaskSubmissionFormProps {
  task: any;
  onSubmit: () => void;
  onCancel: () => void;
  existingSubmission?: any;
}

export const TaskSubmissionForm: React.FC<TaskSubmissionFormProps> = ({
  task,
  onSubmit,
  onCancel,
  existingSubmission,
}) => {
  const { t } = useLanguage();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }
    
    setScreenshot(file);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!screenshot) {
      setError('Please select a screenshot');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Get current user
      
      if (!user) throw new Error('Not authenticated');

      // Upload screenshot to Supabase Storage
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${user.id}/${task.id}/${Date.now()}.${fileExt}`;
      
      // Convert image to base64 for storage in database
      const reader = new FileReader();
      const screenshotUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(screenshot);
      });
      
      console.log('Screenshot converted to base64, length:', screenshotUrl.length);
      console.log('Screenshot URL preview:', screenshotUrl.substring(0, 100) + '...');
      
      // Create task submission
      
      // Calculate verification deadline (5 days from now)
      const verificationDeadline = new Date();
      verificationDeadline.setDate(verificationDeadline.getDate() + 5);
      
      const estimatedApprovalDate = new Date(verificationDeadline);
      
      if (existingSubmission) {
        // Update existing submission
        await api.put(`/submissions/${existingSubmission.id || existingSubmission._id}`, {
            screenshotUrl: screenshotUrl,
            status: 'under_review',
            verificationDeadline: verificationDeadline.toISOString(),
            estimatedApprovalDate: estimatedApprovalDate.toISOString(),
            adminNotes: null,
            reviewedAt: null,
            reviewedBy: null,
        });
      } else {
        // Create new submission - this will make the task unavailable to all users
        await api.post('/submissions', {
            userId: user.id,
            taskId: task.id || task._id,
            companyId: task.companyId?._id || task.companyId,
            platform: task.platform,
            taskType: task.taskType,
            screenshotUrl: screenshotUrl,
            status: 'under_review',
            verificationDeadline: verificationDeadline.toISOString(),
            estimatedApprovalDate: estimatedApprovalDate.toISOString(),
        });
      }
      
      // Task will be automatically deactivated by database trigger
      
      // Show success message
      setShowSuccess(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit();
      }, 3000);
    } catch (error: any) {
      console.error('Submission error:', error);
      setError(error.message || 'Failed to submit task');
    } finally {
      setUploading(false);
    }
  };

  // Success message component
  if (showSuccess) {
    return (
      <div className="bg-green-50 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-green-200">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-2 sm:p-3 rounded-full">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2">
            🎉 {t('submit.success_title')}
          </h3>
          <p className="text-green-700 mb-4 text-sm sm:text-base">
            {existingSubmission ? t('submit.update_success') : t('submit.success_message')}
          </p>
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-sm sm:text-base">{t('submit.review_time')}</span>
            </div>
            <p className="text-green-600 text-xs sm:text-sm mt-2">
              {t('submit.reward_pending', { amount: task.rewardAmount })}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-blue-900 text-sm sm:text-base">
          {existingSubmission ? t('submit.update') : t('submit.title')}
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          icon={X}
          className="text-blue-600 hover:text-blue-700"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs sm:text-sm mb-4 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-blue-400 bg-blue-50'
              : screenshot
              ? 'border-green-400 bg-green-50'
              : 'border-gray-300 hover:border-blue-400'
          }`}
          style={{ padding: '1rem' }}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          {screenshot ? (
            <div className="space-y-2">
              <div className="text-green-600 font-medium text-sm sm:text-base">
                ✓ {screenshot.name}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {(screenshot.size / 1024 / 1024).toFixed(2)} MB
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setScreenshot(null)}
              >
                {t('submit.remove')}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto" />
              <div className="text-gray-600">
                <p className="font-medium text-sm sm:text-base">{t('submit.drop')}</p>
                <p className="text-xs sm:text-sm">{t('submit.browse')}</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
                id="screenshot-upload"
              />
              <label
                htmlFor="screenshot-upload"
                className="inline-block bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                {t('submit.choose')}
              </label>
            </div>
          )}
        </div>

        {existingSubmission && (
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <p className="text-yellow-800 text-xs sm:text-sm">
              <strong>{t('submit.note')}</strong> {t('submit.update_note')}
            </p>
          </div>
        )}

        {(task.platform === 'youtube' || task.platform === 'instagram') && (
          <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
            <p className="text-green-800 text-xs sm:text-sm font-medium mb-2">
              ✓ Multiple Submissions Allowed
            </p>
            <p className="text-green-700 text-xs sm:text-sm">
              You can submit multiple {task.platform === 'youtube' ? 'YouTube' : 'Instagram'} tasks and earn rewards for each one.
            </p>
            {(task.taskType === 'comment') && (
              <p className="text-orange-700 text-xs sm:text-sm mt-2 font-medium">
                ⚠️ Important: You can only submit 1 comment per video/post. Multiple comments on the same video/post will not be paid.
              </p>
            )}
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <p className="text-yellow-800 text-xs sm:text-sm">
            <strong>{t('task.important')}</strong> {t('submit.important_note')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            type="submit"
            disabled={!screenshot || uploading}
            loading={uploading}
            className="flex-1 text-sm sm:text-base"
          >
            {uploading ? t('submit.submitting') : existingSubmission ? t('submit.update_btn') : t('submit.submit')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={uploading}
            className="text-sm sm:text-base"
          >
            {t('submit.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};