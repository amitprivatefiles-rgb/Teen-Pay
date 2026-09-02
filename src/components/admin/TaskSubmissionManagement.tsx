import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, XCircle, Clock, User, Calendar, ExternalLink, Eye } from 'lucide-react';

interface TaskSubmissionManagementProps {
  onStatsUpdate: () => void;
}

const ITEMS_PER_PAGE = 50;

export const TaskSubmissionManagement: React.FC<TaskSubmissionManagementProps> = ({ onStatsUpdate }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'under_review' | 'approved' | 'rejected'>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, page]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let url = `/submissions?page=${page}&limit=${ITEMS_PER_PAGE}`;
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`;
      }
      const data = await api.get(url);
      const items = Array.isArray(data) ? data : data.submissions || [];
      
      setSubmissions(items);
      setHasMore(items.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (submissionId: string, status: 'approved' | 'rejected', notes: string = '') => {
    if (processingId) return;

    setProcessingId(submissionId);
    try {
      await api.put(`/submissions/${submissionId}`, { status, adminNotes: notes });

      await fetchSubmissions();
      onStatsUpdate();
      setSelectedSubmission(null);
      setAdminNotes('');
    } catch (error: any) {
      console.error('Error updating submission:', error);
      alert('Error updating submission: ' + error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under_review':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Under Verification</span>
          </span>
        );
      case 'pending':
        return (
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Ready for Review</span>
          </span>
        );
      case 'approved':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      default:
        return null;
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
        <h2 className="text-2xl font-bold text-gray-900">Task Submissions</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={statusFilter === 'all' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => { setStatusFilter('all'); setPage(0); }}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'pending' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => { setStatusFilter('pending'); setPage(0); }}
        >
          Ready for Review
        </Button>
        <Button
          variant={statusFilter === 'under_review' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => { setStatusFilter('under_review'); setPage(0); }}
        >
          Under Verification
        </Button>
        <Button
          variant={statusFilter === 'approved' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => { setStatusFilter('approved'); setPage(0); }}
        >
          Approved
        </Button>
        <Button
          variant={statusFilter === 'rejected' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => { setStatusFilter('rejected'); setPage(0); }}
        >
          Rejected
        </Button>
      </div>

      {submissions.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Submissions Yet</h3>
            <p className="text-gray-600">
              Task submissions will appear here when users upload screenshots for review.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {submissions.map((submission: any) => (
            <Card key={(submission._id || submission.id)} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <h3 className="font-semibold text-gray-900">
                        {submission.userId?.name || 'Unknown User'}
                      </h3>
                    </div>
                    {getStatusBadge(submission.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>Task:</strong> {submission.taskId?.title || 'Unknown Task'}</p>
                    <p><strong>Email:</strong> {submission.userId?.email || 'N/A'}</p>
                    <p><strong>Reward:</strong> ₹{submission.taskId?.rewardAmount || 0}</p>
                    <p><strong>Review Text:</strong> "{submission.taskId?.reviewText || 'N/A'}"</p>
                    
                    {submission.status === 'under_review' && submission.verificationDeadline && (
                      <p><strong>Verification Deadline:</strong> {new Date(submission.verificationDeadline).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</p>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <span><strong>Screenshot:</strong></span>
                      {submission.screenshotUrl && submission.screenshotUrl.startsWith('data:image/') ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">✓ Available</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">📷 Uploaded</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                    {submission.reviewedAt && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>Reviewed: {new Date(submission.reviewedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    )}
                    {submission.adminNotes && (
                      <p><strong>Admin Notes:</strong> {submission.adminNotes}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSubmission(submission)}
                      icon={Eye}
                    >
                      View Details
                    </Button>
                    
                    {submission.taskId?.googleProfileLink && (
                      <a
                        href={submission.taskId.googleProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Google Profile</span>
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="text-right space-y-3">
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    ₹{submission.taskId?.rewardAmount || 0}
                  </div>
                  
                  {submission.status === 'pending' && (
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate((submission._id || submission.id), 'approved')}
                        icon={CheckCircle}
                        className="w-full"
                        disabled={processingId === (submission._id || submission.id)}
                      >
                        {processingId === (submission._id || submission.id) ? 'Processing...' : 'Approve & Credit'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          if (processingId) return;
                          const notes = prompt('Rejection reason (required):') || '';
                          if (notes.trim()) {
                            handleStatusUpdate((submission._id || submission.id), 'rejected', notes);
                          } else {
                            alert('Please provide a reason for rejection.');
                          }
                        }}
                        icon={XCircle}
                        className="w-full"
                        disabled={processingId === (submission._id || submission.id)}
                      >
                        {processingId === (submission._id || submission.id) ? 'Processing...' : 'Reject'}
                      </Button>
                    </div>
                  )}
                  
                  {submission.status === 'pending' && (
                    <div className="text-center">
                      <div className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm">
                        <Clock className="w-4 h-4 mx-auto mb-1" />
                        <p className="font-medium">Ready for Review</p>
                        <p className="text-xs">Waiting for admin approval</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && submissions.length > 0 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page + 1} {hasMore ? '(more available)' : ''}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
          >
            Next
          </Button>
        </div>
      )}

      {/* Task Details Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Task Submission Details</h3>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>

              <div className="space-y-6">
                {/* User Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">User Information</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p><strong>Name:</strong> {selectedSubmission.userId?.name}</p>
                    <p><strong>Email:</strong> {selectedSubmission.userId?.email}</p>
                  </div>
                </div>

                {/* Task Info */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Task Information</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-2">
                    <p><strong>Title:</strong> {selectedSubmission.taskId?.title}</p>
                    <p><strong>Required Rating:</strong> {selectedSubmission.taskId?.starRating} stars</p>
                    <p><strong>Review Text:</strong> "{selectedSubmission.taskId?.reviewText || 'N/A'}"</p>
                    <p><strong>Reward:</strong> ₹{selectedSubmission.taskId?.rewardAmount}</p>
                    {selectedSubmission.taskId?.googleProfileLink && (
                      <p>
                        <strong>Google Profile:</strong>{' '}
                        <a
                          href={selectedSubmission.taskId.googleProfileLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          View Profile
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                {/* Screenshot */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Submitted Screenshot</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    {selectedSubmission.screenshotUrl && selectedSubmission.screenshotUrl.startsWith('data:image/') ? (
                      <img
                        src={selectedSubmission.screenshotUrl}
                        alt="Task screenshot"
                        className="max-w-full h-auto max-h-96 rounded-lg border border-gray-200 shadow-sm"
                        onError={(e) => {
                          console.error('Image failed to load:', selectedSubmission.screenshotUrl);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'block';
                        }}
                      />
                    ) : (
                      <div className="text-center py-8">
                        <div className="bg-red-100 p-4 rounded-lg">
                          <p className="font-medium text-red-800 mb-2">❌ Image Display Error</p>
                          <p className="text-red-700 text-sm mb-3">
                            Could not display the screenshot image
                          </p>
                          <div className="bg-white p-3 rounded border text-left">
                            <p className="text-sm text-gray-600 mb-2">Screenshot URL:</p>
                            <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                              {selectedSubmission.screenshotUrl}
                            </code>
                          </div>
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'none' }} className="text-center py-8">
                      <div className="bg-red-100 p-4 rounded-lg">
                        <p className="font-medium text-red-800 mb-2">❌ Image Failed to Load</p>
                        <p className="text-red-700 text-sm mb-3">
                          The screenshot could not be displayed
                        </p>
                        <div className="bg-white p-3 rounded border text-left">
                          <p className="text-sm text-gray-600 mb-2">Screenshot URL:</p>
                          <code className="text-xs bg-gray-100 p-2 rounded block break-all">
                            {selectedSubmission.screenshotUrl}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Actions */}
                {selectedSubmission.status === 'pending' && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Admin Actions</h4>
                    <div className="space-y-3">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleStatusUpdate((selectedSubmission._id || selectedSubmission.id), 'approved', adminNotes)}
                          icon={CheckCircle}
                          className="flex-1"
                          disabled={processingId === (selectedSubmission._id || selectedSubmission.id)}
                        >
                          {processingId === (selectedSubmission._id || selectedSubmission.id) ? 'Processing...' : `Approve & Credit ₹${selectedSubmission.taskId?.rewardAmount}`}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            if (processingId) return;
                            if (!adminNotes.trim()) {
                              alert('Please provide a reason for rejection.');
                              return;
                            }
                            handleStatusUpdate((selectedSubmission._id || selectedSubmission.id), 'rejected', adminNotes);
                          }}
                          icon={XCircle}
                          className="flex-1"
                          disabled={processingId === (selectedSubmission._id || selectedSubmission.id)}
                        >
                          {processingId === (selectedSubmission._id || selectedSubmission.id) ? 'Processing...' : 'Reject Task'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedSubmission.status === 'under_review' && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Admin Actions</h4>
                    <div className="space-y-3">
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add notes (optional for approval, required for rejection)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                      />
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleStatusUpdate((selectedSubmission._id || selectedSubmission.id), 'approved', adminNotes)}
                          icon={CheckCircle}
                          className="flex-1"
                          disabled={processingId === (selectedSubmission._id || selectedSubmission.id)}
                        >
                          {processingId === (selectedSubmission._id || selectedSubmission.id) ? 'Processing...' : `Approve & Credit ₹${selectedSubmission.taskId?.rewardAmount}`}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            if (processingId) return;
                            if (!adminNotes.trim()) {
                              alert('Please provide a reason for rejection.');
                              return;
                            }
                            handleStatusUpdate((selectedSubmission._id || selectedSubmission.id), 'rejected', adminNotes);
                          }}
                          icon={XCircle}
                          className="flex-1"
                          disabled={processingId === (selectedSubmission._id || selectedSubmission.id)}
                        >
                          {processingId === (selectedSubmission._id || selectedSubmission.id) ? 'Processing...' : 'Reject Task'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};