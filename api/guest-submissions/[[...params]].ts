import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import GuestTaskSubmission from '../_lib/models/GuestTaskSubmission';
import Task from '../_lib/models/Task';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const { params } = req.query;
  const paramList = Array.isArray(params) ? params : params ? [params] : [];
  
  try {
    if (req.method === 'GET') {
      if (paramList[0] === 'check') {
        const { taskId, email } = req.query;
        const existing = await GuestTaskSubmission.findOne({ taskId, guestEmail: email });
        return res.status(200).json({ exists: !!existing, status: existing?.status });
      } else if (paramList.length === 0 || paramList[0] === 'undefined') {
        const user = await requireAuth(req, res);
        if (!user || (user.role !== 'admin' && user.role !== 'company')) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        const { status, companyId, page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);
        
        let filter: any = {};
        if (status) filter.status = status;
        if (companyId) filter.companyId = companyId;
        
        const submissions = await GuestTaskSubmission.find(filter)
          .populate('taskId')
          .skip(skip)
          .limit(Number(limit))
          .sort({ createdAt: -1 });
          
        return res.status(200).json(submissions);
      }
    } else if (req.method === 'POST') {
      if (paramList.length === 0) {
        const { taskId, guestEmail, screenshotUrl } = req.body;
        
        const task = await Task.findById(taskId);
        if (!task || !task.active || !task.shareable) {
          return res.status(400).json({ error: 'Invalid or inactive task' });
        }
        
        const existing = await GuestTaskSubmission.findOne({ taskId, guestEmail });
        if (existing) {
          return res.status(400).json({ error: 'Duplicate submission' });
        }
        
        const submission = new GuestTaskSubmission({
          taskId, guestEmail, screenshotUrl,
          companyId: task.companyId,
          platform: task.platform,
          taskType: task.taskType,
          rewardAmount: task.rewardAmount,
          status: 'pending'
        });
        await submission.save();
        return res.status(201).json(submission);
      }
    } else if (req.method === 'PUT') {
      if (paramList.length === 1 && paramList[0] !== 'check' && paramList[0] !== 'undefined') {
        const id = paramList[0];
        const user = await requireAuth(req, res);
        if (!user || (user.role !== 'admin' && user.role !== 'company')) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        
        const { status, adminNotes } = req.body;
        if (status === 'rejected' && !adminNotes) {
          return res.status(400).json({ error: 'adminNotes required for rejection' });
        }
        
        const submission = await GuestTaskSubmission.findById(id);
        if (!submission) return res.status(404).json({ error: 'Not found' });
        
        submission.status = status;
        submission.adminNotes = adminNotes;
        await submission.save();
        
        if (status === 'approved') {
          const registeredUser = await User.findOne({ email: submission.guestEmail });
          if (registeredUser) {
            await User.findByIdAndUpdate(registeredUser._id, {
              $inc: { totalEarnings: submission.rewardAmount, dailyEarnings: submission.rewardAmount }
            });
          }
        }
        
        return res.status(200).json(submission);
      }
    }
    
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
