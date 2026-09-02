import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import TaskSubmission from '../_lib/models/TaskSubmission';
import User from '../_lib/models/User';
import Task from '../_lib/models/Task';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (user.role !== 'admin' && user.role !== 'company') return res.status(403).json({ error: 'Forbidden' });

      const { status, adminNotes } = req.body;
      const submission: any = await TaskSubmission.findById(id).populate('taskId');
      if (!submission) return res.status(404).json({ error: 'Not found' });

      submission.status = status;
      submission.adminNotes = adminNotes;
      submission.reviewedAt = new Date();
      submission.reviewedBy = user._id;

      if (status === 'approved') {
        const amount = submission.taskId.rewardAmount;
        await User.findByIdAndUpdate(submission.userId, {
          $inc: { totalEarnings: amount, dailyEarnings: amount }
        });
      }

      await submission.save();
      return res.status(200).json(submission);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const submission: any = await TaskSubmission.findById(id);
      if (!submission) return res.status(404).json({ error: 'Not found' });
      
      if (submission.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (submission.status !== 'pending' && submission.status !== 'under_review') {
        return res.status(400).json({ error: 'Cannot delete processed submission' });
      }

      await TaskSubmission.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
