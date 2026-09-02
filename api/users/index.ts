import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 }).select('-passwordHash');

    return res.status(200).json(users);
  } catch (error: any) {
    console.error('Users list error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
