import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import GuestTaskSubmission from '../_lib/models/GuestTaskSubmission';
import Task from '../_lib/models/Task';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (user.role !== 'admin' && user.role !== 'company') return res.status(403).json({ error: 'Forbidden' });

      const query: any = {};
      if (req.query.status) query.status = req.query.status;
      if (req.query.companyId) query.companyId = req.query.companyId;

      const submissions = await GuestTaskSubmission.find(query)
        .populate('taskId')
        .sort({ createdAt: -1 });
      return res.status(200).json(submissions);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { taskId, guestEmail, screenshotUrl } = req.body;
      const task = await Task.findById(taskId);
      if (!task || !task.active || !task.shareable) {
        return res.status(400).json({ error: 'Task unavailable' });
      }
      
      const existing = await GuestTaskSubmission.findOne({ guestEmail, taskId });
      if (existing) return res.status(400).json({ error: 'Duplicate submission' });

      const submission = await GuestTaskSubmission.create({
        taskId, guestEmail, screenshotUrl,
        companyId: task.companyId,
        platform: task.platform,
        taskType: task.taskType,
        rewardAmount: task.rewardAmount,
        status: 'pending'
      });
      return res.status(201).json(submission);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
