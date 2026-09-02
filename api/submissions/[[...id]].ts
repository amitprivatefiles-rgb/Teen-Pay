import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import { TaskSubmission } from '../_models/TaskSubmission';
import { User } from '../_models/User';
import { Task } from '../_models/Task';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const { id } = req.query;
  const submissionId = Array.isArray(id) ? id[0] : id;

  try {
    if (req.method === 'GET') {
      if (!submissionId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        
        let filter: any = {};
        if (status) filter.status = status;
        
        if (user.role === 'admin') {
          // All submissions
        } else if (user.role === 'company') {
           if (req.query.companyId) filter.companyId = req.query.companyId;
        } else {
          filter.userId = user._id;
        }
        
        const submissions = await TaskSubmission.find(filter)
          .populate('userId', 'name email')
          .populate('taskId', 'title rewardAmount')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 });
          
        return res.status(200).json(submissions);
      }
    } else if (req.method === 'POST') {
      if (!submissionId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const { taskId, companyId, platform, taskType, screenshotUrl } = req.body;
        const submission = new TaskSubmission({
          taskId, companyId, platform, taskType, screenshotUrl,
          userId: user._id,
          status: 'under_review'
        });
        await submission.save();
        return res.status(201).json(submission);
      }
    } else if (req.method === 'PUT') {
      if (submissionId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        if (user.role !== 'admin' && user.role !== 'company') {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        const { status, adminNotes } = req.body;
        const submission = await TaskSubmission.findById(submissionId);
        if (!submission) return res.status(404).json({ error: 'Not found' });
        
        submission.status = status;
        submission.adminNotes = adminNotes;
        await submission.save();
        
        if (status === 'approved') {
          const task = await Task.findById(submission.taskId);
          if (task && submission.userId) {
            await User.findByIdAndUpdate(submission.userId, {
              $inc: { totalEarnings: task.rewardAmount, dailyEarnings: task.rewardAmount }
            });
          }
        }
        
        return res.status(200).json(submission);
      }
    } else if (req.method === 'DELETE') {
      if (submissionId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const submission = await TaskSubmission.findById(submissionId);
        if (!submission) return res.status(404).json({ error: 'Not found' });
        
        if (submission.userId.toString() !== user._id.toString()) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        await TaskSubmission.findByIdAndDelete(submissionId);
        return res.status(200).json({ message: 'Deleted successfully' });
      }
    }
    
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
