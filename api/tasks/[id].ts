import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth, getAuthUser } from '../_lib/auth';
import Task from '../_lib/models/Task';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const task = await Task.findById(id).populate('companyId');
      if (!task) return res.status(404).json({ error: 'Not found' });
      const user = await getAuthUser(req);
      const isAdmin = user && user.role === 'admin';
      if (!isAdmin && (!task.active || !task.shareable) && !user) {
         return res.status(404).json({ error: 'Not found' });
      }
      return res.status(200).json(task);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (user.role !== 'admin' && user.role !== 'company') return res.status(403).json({ error: 'Forbidden' });
      const task = await Task.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(task);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (user.role !== 'admin' && user.role !== 'company') return res.status(403).json({ error: 'Forbidden' });
      const task = await Task.findByIdAndUpdate(id, { active: req.body.active }, { new: true });
      return res.status(200).json(task);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (user.role !== 'admin' && user.role !== 'company') return res.status(403).json({ error: 'Forbidden' });
      await Task.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
