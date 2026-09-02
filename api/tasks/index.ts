import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth, getAuthUser } from '../_lib/auth';
import Task from '../_lib/models/Task';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    try {
      const user = await getAuthUser(req);
      const query: any = {};
      if (req.query.companyId) {
        query.companyId = req.query.companyId;
      }
      
      if (!user || user.role !== 'admin') {
        query.active = true;
      }

      const tasks = await Task.find(query).populate('companyId', 'name').sort({ createdAt: -1 });
      return res.status(200).json(tasks);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return; // response handled in requireAuth
      if (user.role !== 'admin' && user.role !== 'company') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { title, companyId, platform, taskType, taskLink, googleProfileLink, reviewText, starRating, rewardAmount, maxUsers, shareable } = req.body;
      
      const taskData: any = {
        title, companyId, platform, taskType, taskLink, googleProfileLink, reviewText, starRating, rewardAmount, maxUsers, shareable
      };

      if (user.role === 'company') {
        taskData.companyId = user.companyId;
        taskData.createdByCompanyUser = true;
      }

      const task = await Task.create(taskData);
      return res.status(201).json(task);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
