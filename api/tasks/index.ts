import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth, requireAdmin, getAuthUser } from '../_lib/auth';
import Task from '../_lib/models/Task';
import CompanyUser from '../_lib/models/CompanyUser';
import Company from '../_lib/models/Company';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();
  // Ensure Company model is registered for populate
  void Company;

  const id = (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id) as string | undefined;
  const companyId = (Array.isArray(req.query.companyId) ? req.query.companyId[0] : req.query.companyId) as string | undefined;

  try {
    if (req.method === 'GET') {
      if (!id) {
        const user = await getAuthUser(req);
        if (!user) return res.status(401).json({ error: 'Unauthorized' });
        
        if (user.role === 'admin') {
          const filter = companyId ? { companyId } : {};
          const tasks = await Task.find(filter).populate('companyId').sort({ createdAt: -1 });
          return res.status(200).json(tasks);
        } else if (user.role === 'company') {
          const companyUser = await CompanyUser.findOne({ userId: user._id });
          const filter: any = {};
          if (companyUser) filter.companyId = companyUser.companyId;
          else if (companyId) filter.companyId = companyId;
          const tasks = await Task.find(filter).populate('companyId').sort({ createdAt: -1 });
          return res.status(200).json(tasks);
        } else {
          const filter: any = { active: true };
          if (companyId) filter.companyId = companyId;
          const tasks = await Task.find(filter).populate('companyId').sort({ createdAt: -1 });
          return res.status(200).json(tasks);
        }
      } else {
        // Public (no auth)
        const task = await Task.findById(id).populate('companyId');
        if (!task) return res.status(404).json({ error: 'Not found' });
        
        const user = await getAuthUser(req);
        if (!task.active && !user && !task.shareable) { 
          return res.status(404).json({ error: 'Not found' });
        }
        return res.status(200).json(task);
      }
    } else if (req.method === 'POST') {
      if (!id) {
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
      if (id) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
        if (!task) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(task);
      }
    } else if (req.method === 'PATCH') {
      if (id) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const { active } = req.body;
        const task = await Task.findByIdAndUpdate(id, { active }, { new: true });
        if (!task) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json(task);
      }
    } else if (req.method === 'DELETE') {
      if (id) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const task = await Task.findByIdAndDelete(id);
        if (!task) return res.status(404).json({ error: 'Not found' });
        return res.status(200).json({ message: 'Deleted successfully' });
      }
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
