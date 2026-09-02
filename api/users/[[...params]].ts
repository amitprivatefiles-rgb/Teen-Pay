import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const { params } = req.query;
  const p = Array.isArray(params) ? params : (params ? [params] : []);

  try {
    if (req.method === 'GET' && p.length === 0) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const users = await User.find({ role: 'user' }, { passwordHash: 0 }).sort({ createdAt: -1 });
      return res.json(users);
    }

    if (req.method === 'PUT' && p.length === 2 && p[1] === 'suspend') {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const userId = p[0];
      const { suspended, suspensionReason } = req.body;
      const user = await User.findByIdAndUpdate(userId, { suspended, suspensionReason }, { new: true, select: '-passwordHash' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json(user);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
