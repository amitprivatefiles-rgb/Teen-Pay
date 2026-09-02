import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, Clock, XCircle, Eye, ThumbsUp, ThumbsDown, Mail } from 'lucide-react';

interface CompanyTaskProgressProps {
  companyUser: any;
}

export const CompanyTaskProgress: React.FC<CompanyTaskProgressProps> = ({ companyUser }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [guestSubmissions, setGuestSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'guest'>('all');

  useEffect(() => {
    loadSubmissions();
  }, [companyUser, filter]);

  const loadSubmissions = async () => {
    try {
      console.log('[CompanyTaskProgress] Loading submissions for company:', companyUser.companyId);

      if (filter === 'guest') {
        // Load guest submissions
        const guestData = await api.get('/guest-submissions?companyId=' + companyUser.companyId);
        setGuestSubmissions(guestData || []);
        setSubmissions([]);
      } else {
        const data = await api.get('/submissions?companyId=' + companyUser.companyId);

        console.log('[CompanyTaskProgress] Submissions:', data, 'Error:', error);

        
        setSubmissions(data || []);
        setGuestSubmissions([]);
      }
    } catch (err) {
      console.error('[CompanyTaskProgress] Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-orange-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  const handleApprove = async (submissionId: string) => {
    try {
      await api.put(`/submissions/${submissionId}`, { status: 'approved' });

      

      await loadSubmissions();
    } catch (err) {
      console.error('Error approving submission:', err);
      alert('Failed to approve submission. Please try again.');
    }
  };

  const handleReject = async (submissionId: string) => {
    const notes = prompt('Enter rejection reason (optional):');

    try {
      await api.put(`/submissions/${submissionId}`, { status: 'approved' });

      

      await loadSubmissions();
    } catch (err) {
      console.error('Error rejecting submission:', err);
      alert('Failed to reject submission. Please try again.');
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Task Progress & Submissions</h2>
        <div className="flex space-x-2">
          {['all', 'pending', 'approved', 'rejected', 'guest'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {submissions.map((submission) => (
          <Card key={submission.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(submission.status)}
                  <h3 className="font-semibold text-gray-900">{submission.taskId.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                    {submission.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">User:</span>
                    <span className="ml-2 font-medium text-gray-900">{submission.userId.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reward:</span>
                    <span className="ml-2 font-medium text-green-600">₹{submission.taskId.rewardAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(submission.submittedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {submission.adminNotes && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <span className="font-medium text-gray-700">Notes: </span>
                    <span className="text-gray-600">{submission.adminNotes}</span>
                  </div>
                )}

                {submission.screenshotUrl && (
                  <div className="mt-3">
                    <a
                      href={submission.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Screenshot</span>
                    </a>
                  </div>
                )}
              </div>

              {(submission.status === 'pending' || submission.status === 'under_review') && (
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    onClick={() => handleApprove(submission.id)}
                    variant="primary"
                    icon={ThumbsUp}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(submission.id)}
                    variant="outline"
                    icon={ThumbsDown}
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}

        {submissions.length === 0 && guestSubmissions.length === 0 && (
          <Card className="p-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {filter === 'guest' ? 'No Guest Submissions Yet' : 'No Submissions Yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'guest'
                ? 'Guest submissions from shareable task links will appear here'
                : 'Task submissions will appear here once users start completing tasks'}
            </p>
          </Card>
        )}

        {/* Guest Submissions */}
        {guestSubmissions.map((submission) => (
          <Card key={submission.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  {getStatusIcon(submission.status)}
                  <h3 className="font-semibold text-gray-900">{submission.taskId?.title || 'Unknown Task'}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(submission.status)}`}>
                    {submission.status.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    Guest
                  </span>
                  {submission.creditedToUserId && (
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Credited
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-medium text-gray-900 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />{submission.guestEmail}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Reward:</span>
                    <span className="ml-2 font-medium text-green-600">₹{submission.rewardAmount}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Submitted:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {new Date(submission.submittedAt).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>

                {submission.adminNotes && (
                  <div className="bg-gray-50 rounded-lg p-3 text-sm">
                    <span className="font-medium text-gray-700">Notes: </span>
                    <span className="text-gray-600">{submission.adminNotes}</span>
                  </div>
                )}

                {submission.screenshotUrl && (
                  <div className="mt-3">
                    <a
                      href={submission.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Screenshot</span>
                    </a>
                  </div>
                )}
              </div>

              {(submission.status === 'pending') && (
                <div className="flex flex-col space-y-2 ml-4">
                  <Button
                    onClick={async () => {
                      try {
                        await api.put(`/guest-submissions/${submission._id || submission.id}`, {
                          status: 'approved',
                        });
                        await loadSubmissions();
                      } catch (err) {
                        console.error('Error approving guest submission:', err);
                        alert('Failed to approve. Please try again.');
                      }
                    }}
                    variant="primary"
                    icon={ThumbsUp}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={async () => {
                      const notes = prompt('Enter rejection reason:');
                      if (!notes) return;
                      try {
                        await api.put(`/guest-submissions/${submission._id || submission.id}`, {
                          status: 'rejected',
                          adminNotes: notes,
                        });
                        await loadSubmissions();
                      } catch (err) {
                        console.error('Error rejecting guest submission:', err);
                        alert('Failed to reject. Please try again.');
                      }
                    }}
                    variant="outline"
                    icon={ThumbsDown}
                    size="sm"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
