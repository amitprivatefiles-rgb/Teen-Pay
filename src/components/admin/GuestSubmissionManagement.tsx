import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  CheckCircle, XCircle, Eye, Mail, Calendar, Clock,
  AlertCircle, ChevronLeft, ChevronRight, UserCheck, UserX,
  ExternalLink, X, IndianRupee
} from 'lucide-react';

interface GuestSubmissionManagementProps {
  onStatsUpdate: () => void;
}

export const GuestSubmissionManagement: React.FC<GuestSubmissionManagementProps> = ({ onStatsUpdate }) => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [inspectingSubmission, setInspectingSubmission] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const PAGE_SIZE = 50;

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter, page]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('guest_task_submissions')
        .select(`
          *,
          tasks(title, rewardAmount, platform, taskType)
        `)
        .order('submittedAt', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
setSubmissions(data || []);
      setHasMore((data || []).length === PAGE_SIZE);
    } catch (err) {
      console.error('Error fetching guest submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submission: any) => {
    if (processingId) return;
    setProcessingId(submission.id);

    try {
      

      // 1. Approve the guest submission
      const { error: updateError } = await supabase
        .from('guest_task_submissions')
        .update({
          status: 'approved',
          reviewedAt: new Date().toISOString(),
          reviewedBy: user?.id,
          adminNotes: adminNotes || null,
        })
        .eq('id', submission.id);

      if (updateError) throw updateError;

      // 2. Check if a user account exists with this email
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, totalEarnings')
        .eq('email', submission.guestEmail)
        .single();

      if (existingProfile) {
        // Credit immediately
        const newEarnings = (existingProfile.totalEarnings || 0) + submission.rewardAmount;
        await supabase
          .from('profiles')
          .update({ totalEarnings: newEarnings })
          .eq('id', existingProfile.id);

        await supabase
          .from('guest_task_submissions')
          .update({
            creditedToUserId: existingProfile.id,
            creditedAt: new Date().toISOString(),
          })
          .eq('id', submission.id);
      }
      // If no profile exists, rewards will be credited on signup via trigger

      setInspectingSubmission(null);
      setAdminNotes('');
      fetchSubmissions();
      onStatsUpdate();
    } catch (err: any) {
      console.error('Error approving submission:', err);
      alert('Error approving: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (submission: any) => {
    if (processingId) return;

    const reason = adminNotes.trim() || prompt('Please provide a rejection reason:');
    if (!reason) {
      alert('Rejection reason is required.');
      return;
    }

    setProcessingId(submission.id);

    try {
      

      const { error } = await supabase
        .from('guest_task_submissions')
        .update({
          status: 'rejected',
          reviewedAt: new Date().toISOString(),
          reviewedBy: user?.id,
          adminNotes: reason,
        })
        .eq('id', submission.id);
setInspectingSubmission(null);
      setAdminNotes('');
      fetchSubmissions();
      onStatsUpdate();
    } catch (err: any) {
      console.error('Error rejecting submission:', err);
      alert('Error rejecting: ' + err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Rejected</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const statusTabs = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Guest Submissions</h2>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(0); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              statusFilter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><LoadingSpinner /></div>
      ) : submissions.length === 0 ? (
        <Card className="p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No Guest Submissions</h3>
          <p className="text-gray-600">Guest submissions from shareable task links will appear here.</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {submissions.map((sub) => (
              <Card key={sub.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-gray-900 truncate">{sub.guestEmail}</span>
                      {getStatusBadge(sub.status)}
                      {sub.creditedToUserId && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium flex items-center space-x-1">
                          <UserCheck className="w-3 h-3" />
                          <span>Credited</span>
                        </span>
                      )}
                      {sub.status === 'approved' && !sub.creditedToUserId && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium flex items-center space-x-1">
                          <UserX className="w-3 h-3" />
                          <span>Unclaimed</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="font-medium">{sub.taskId?.title || 'Unknown Task'}</span>
                      <span>•</span>
                      <span className="text-green-600 font-semibold">₹{sub.rewardAmount}</span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(sub.submittedAt)}</span>
                      </span>
                    </div>
                    {sub.adminNotes && (
                      <p className="text-sm text-gray-500 mt-2 italic">Note: {sub.adminNotes}</p>
                    )}
                    {sub.reviewedAt && (
                      <p className="text-xs text-gray-400 mt-1">
                        Reviewed: {formatDate(sub.reviewedAt)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Eye}
                      onClick={() => { setInspectingSubmission(sub); setAdminNotes(sub.adminNotes || ''); }}
                    >
                      View
                    </Button>
                    {sub.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          icon={CheckCircle}
                          onClick={() => handleApprove(sub)}
                          disabled={!!processingId}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          icon={XCircle}
                          onClick={() => handleReject(sub)}
                          disabled={!!processingId}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              icon={ChevronLeft}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">Page {page + 1}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={!hasMore}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </>
      )}

      {/* Inspection Modal */}
      {inspectingSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setInspectingSubmission(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Guest Submission Details</h3>
              <button onClick={() => setInspectingSubmission(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium">{inspectingSubmission.guestEmail}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="mt-1">{getStatusBadge(inspectingSubmission.status)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Task</span>
                  <p className="font-medium">{inspectingSubmission.taskId?.title}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Reward</span>
                  <p className="font-medium text-green-600">₹{inspectingSubmission.rewardAmount}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Submitted</span>
                  <p className="font-medium">{formatDate(inspectingSubmission.submittedAt)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Credit Status</span>
                  <p className="font-medium">
                    {inspectingSubmission.creditedToUserId ? (
                      <span className="text-blue-600">Credited ✓</span>
                    ) : inspectingSubmission.status === 'approved' ? (
                      <span className="text-orange-600">Unclaimed (no account)</span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Screenshot */}
              {inspectingSubmission.screenshotUrl && (
                <div>
                  <span className="text-sm text-gray-500 block mb-2">Screenshot Proof</span>
                  <img
                    src={inspectingSubmission.screenshotUrl}
                    alt="Proof screenshot"
                    className="max-w-full max-h-96 rounded-xl border border-gray-200 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '';
                      e.currentTarget.alt = 'Failed to load screenshot';
                    }}
                  />
                </div>
              )}

              {/* Admin Notes */}
              {inspectingSubmission.status === 'pending' && (
                <div>
                  <label className="text-sm text-gray-500 block mb-1">Admin Notes (optional for approve, required for reject)</label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={3}
                    placeholder="Add notes..."
                  />
                </div>
              )}

              {inspectingSubmission.adminNotes && inspectingSubmission.status !== 'pending' && (
                <div>
                  <span className="text-sm text-gray-500">Admin Notes</span>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{inspectingSubmission.adminNotes}</p>
                </div>
              )}

              {/* Action Buttons */}
              {inspectingSubmission.status === 'pending' && (
                <div className="flex gap-3 pt-2">
                  <Button
                    icon={CheckCircle}
                    onClick={() => handleApprove(inspectingSubmission)}
                    disabled={!!processingId}
                    className="flex-1"
                  >
                    {processingId === inspectingSubmission.id ? 'Processing...' : 'Approve & Credit'}
                  </Button>
                  <Button
                    variant="danger"
                    icon={XCircle}
                    onClick={() => handleReject(inspectingSubmission)}
                    disabled={!!processingId}
                    className="flex-1"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
