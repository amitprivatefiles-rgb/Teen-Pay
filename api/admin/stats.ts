import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import User from '../_lib/models/User';
import Task from '../_lib/models/Task';
import Withdrawal from '../_lib/models/Withdrawal';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const totalUsers = await User.countDocuments({ role: 'user' });
      const totalTasks = await Task.countDocuments({});
      const earningsAgg = await User.aggregate([{ $match: { role: 'user' } }, { $group: { _id: null, total: { $sum: '$totalEarnings' } } }]);
      const withdrawalsAgg = await Withdrawal.aggregate([{ $match: { status: 'pending' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
      
      return res.json({ 
        totalUsers, 
        totalTasks, 
        totalEarnings: earningsAgg[0]?.total || 0, 
        pendingWithdrawals: withdrawalsAgg[0]?.total || 0 
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
