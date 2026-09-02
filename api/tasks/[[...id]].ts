import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth, requireAdmin, getAuthUser } from '../_lib/auth';
import Task from '../_lib/models/Task';
import CompanyUser from '../_lib/models/CompanyUser';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const { id } = req.query;
  const taskId = Array.isArray(id) ? id[0] : id;

  try {
    if (req.method === 'GET') {
      if (!taskId) {
        const user = await getAuthUser(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        
        if (user.role === 'admin') {
          const { companyId } = req.query;
          const filter = companyId ? { companyId } : {};
          const tasks = await Task.find(filter).populate('companyId').sort({ createdAt: -1 });
          return res.status(200).json(tasks);
        } else {
          const tasks = await Task.find({ active: true });
          return res.status(200).json(tasks);
        }
      } else {
        // Public (no auth)
        const task = await Task.findById(taskId).populate('companyId');
        if (!task) return res.status(404).json({ error: 'Not found' });
        
        const user = await getAuthUser(req);
        if (!task.active && !user && !task.shareable) { 
          return res.status(404).json({ error: 'Not found' });
        }
        return res.status(200).json(task);
      }
    } else if (req.method === 'POST') {
      if (!taskId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const taskData = req.body;
        if (user.role === 'company') {
          const companyUser = await CompanyUser.findOne({ userId: user._id });
          if (companyUser) taskData.companyId = companyUser.companyId;
        }
        
        const task = new Task(taskData);
        await task.save();
        return res.status(201).json(task);
      }
    } else if (req.method === 'PUT') {
      if (taskId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const task = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
        return res.status(200).json(task);
      }
    } else if (req.method === 'PATCH') {
      if (taskId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const { active } = req.body;
        const task = await Task.findByIdAndUpdate(taskId, { active }, { new: true });
        return res.status(200).json(task);
      }
    } else if (req.method === 'DELETE') {
      if (taskId) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        await Task.findByIdAndDelete(taskId);
        return res.status(200).json({ message: 'Deleted successfully' });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
