import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Edit, Trash2, Upload, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { TaskSubmissionForm } from './TaskSubmissionForm';

interface PendingTasksProps {
  userProfile: any;
  onUpdate: () => void;
}

export const PendingTasks: React.FC<PendingTasksProps> = ({ userProfile, onUpdate }) => {
  const { t } = useLanguage();
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSubmission, setEditingSubmission] = useState(null);

  useEffect(() => {
    fetchPendingSubmissions();
  }, [userProfile.id]);

  const fetchPendingSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('task_submissions')
        .select(`
          *,
          tasks(title, rewardAmount, googleProfileLink, reviewText, starRating)
        `)
        .eq('userId', userProfile.id)
        .order('submittedAt', { ascending: false });

      if (error) throw error;
      setPendingSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching pending submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    if (!confirm(t('general.confirm'))) return;

    try {
      const { error } = await supabase
        .from('task_submissions')
        .delete()
        .eq('id', submissionId)
        .eq('userId', userProfile.id); // Extra security check

      if (error) throw error;
      
      fetchPendingSubmissions();
      onUpdate();
    } catch (error) {
      console.error('Error deleting submission:', error);
      alert('Error deleting submission: ' + error.message);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under_review':
        return (
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{t('pending.verification')}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{t('pending.ready')}</span>
          </span>
        );
      case 'approved':
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>{t('history.approved')}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
            <XCircle className="w-4 h-4" />
            <span>{t('status.rejected')}</span>
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
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

  if (pendingSubmissions.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('pending.none')}</h3>
          <p className="text-gray-600">
            {t('pending.description')}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{t('pending.title')}</h2>
        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-blue-700 text-sm font-medium">{t('pending.submissions', { count: pendingSubmissions.length })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pendingSubmissions.map((submission) => (
          <Card key={submission.id} className="p-6">
            {editingSubmission?.id === submission.id ? (
              <TaskSubmissionForm
                task={submission.tasks}
                onSubmit={() => {
                  setEditingSubmission(null);
                  fetchPendingSubmissions();
                  onUpdate();
                }}
                onCancel={() => setEditingSubmission(null)}
                existingSubmission={submission}
              />
            ) : (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {submission.taskId?.title || 'Unknown Task'}
                    </h3>
                    <div className="flex items-center space-x-3 mb-3">
                      {getStatusBadge(submission.status)}
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                        ₹{submission.taskId?.rewardAmount || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submission Details */}
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>{t('pending.submitted')}</strong> {new Date(submission.submittedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  
                  {submission.status === 'under_review' && submission.estimatedApprovalDate && (
                    <p><strong>{t('pending.estimated')}</strong> {new Date(submission.estimatedApprovalDate).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</p>
                  )}
                  
                  {submission.reviewedAt && (
                    <p><strong>{t('pending.reviewed')}</strong> {new Date(submission.reviewedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</p>
                  )}

                  {submission.adminNotes && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-yellow-800"><strong>{t('pending.notes')}</strong></p>
                      <p className="text-yellow-700 text-sm mt-1">{submission.adminNotes}</p>
                    </div>
                  )}
                </div>

                {/* Screenshot Preview */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('pending.screenshot')}</p>
                  <div className="relative">
                    {submission.screenshotUrl.startsWith('data:image/') ? (
                      <img
                        src={submission.screenshotUrl}
                        alt="Task screenshot"
                        className="w-full h-32 object-cover rounded border border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <div className="text-2xl mb-1">📷</div>
                          <p className="text-xs">{t('pending.uploaded')}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  {(submission.status === 'pending' || submission.status === 'under_review') && (
                    <Button
                      size="sm"
                      variant="outline"
                      type="button"
                      onClick={() => setEditingSubmission(submission)}
                      icon={Edit}
                      className="flex-1"
                    >
                      {t('pending.edit')}
                    </Button>
                  )}
                  
                  {(submission.status === 'pending' || submission.status === 'under_review' || submission.status === 'rejected') && (
                    <Button
                      size="sm"
                      variant="danger"
                      type="button"
                      onClick={() => handleDeleteSubmission(submission.id)}
                      icon={Trash2}
                      className="flex-1"
                    >
                      {t('pending.delete')}
                    </Button>
                  )}

                  {submission.status === 'rejected' && (
                    <Button
                      size="sm"
                      type="button"
                      onClick={() => setEditingSubmission(submission)}
                      icon={Upload}
                      className="flex-1"
                    >
                      {t('pending.resubmit')}
                    </Button>
                  )}
                </div>

                {/* Status Messages */}
                {submission.status === 'approved' && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">{t('status.approved', { amount: submission.taskId?.rewardAmount })}</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      {t('status.credited')}
                    </p>
                  </div>
                )}

                {submission.status === 'under_review' && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{t('status.submitted')}</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1">
                      {t('status.review')}
                    </p>
                  </div>
                )}

                {submission.status === 'rejected' && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-red-800">
                      <XCircle className="w-4 h-4" />
                      <span className="font-medium">{t('status.rejected')}</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      {submission.adminNotes || t('status.tryagain')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};