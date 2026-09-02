import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import TaskSubmission from '../_lib/models/TaskSubmission';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const page = parseInt(req.query.page as string) || 0;
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = page * limit;

      const query: any = {};
      if (req.query.status) query.status = req.query.status;

      let populateOpts: any = [{ path: 'taskId', select: 'title rewardAmount' }];

      if (user.role === 'admin') {
        populateOpts.push({ path: 'userId', select: 'name email' });
      } else if (user.role === 'company') {
        query.companyId = user.companyId;
        populateOpts.push({ path: 'userId', select: 'name email' });
      } else {
        query.userId = user._id;
      }

      const submissions = await TaskSubmission.find(query)
        .populate(populateOpts)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });
        
      return res.status(200).json(submissions);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;

      const { taskId, companyId, platform, taskType, screenshotUrl } = req.body;
      const existing = await TaskSubmission.findOne({ userId: user._id, companyId, platform, taskType });
      if (existing) return res.status(400).json({ error: 'Duplicate submission' });

      const submission = await TaskSubmission.create({
        userId: user._id,
        taskId, companyId, platform, taskType, screenshotUrl,
        status: 'under_review',
        submittedAt: new Date()
      });
      return res.status(201).json(submission);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
