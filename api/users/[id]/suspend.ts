import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../_lib/mongodb';
import { handleCors, requireAdmin } from '../../_lib/auth';
import User from '../../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { id } = req.query;
    const { suspended, suspensionReason } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.suspended = suspended;
    user.suspendedAt = suspended ? new Date() : null;
    user.suspendedBy = suspended ? admin._id : null;
    user.suspensionReason = suspensionReason || null;

    await user.save();

    const userData = user.toObject();
    delete userData.passwordHash;

    return res.status(200).json(userData);
  } catch (error: any) {
    console.error('Suspend user error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
