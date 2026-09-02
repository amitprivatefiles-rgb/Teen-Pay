import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const id = (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id) as string | undefined;
  const action = (Array.isArray(req.query.action) ? req.query.action[0] : req.query.action) as string | undefined;

  try {
    if (req.method === 'GET' && !id && !action) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const users = await User.find({ role: 'user' }, { passwordHash: 0 }).sort({ createdAt: -1 });
      return res.json(users);
    }

    if (req.method === 'PUT' && id && action === 'suspend') {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { suspended, suspensionReason } = req.body;
      const user = await User.findByIdAndUpdate(id, { suspended, suspensionReason }, { new: true, select: '-passwordHash' });
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json(user);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
