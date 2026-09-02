import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import User from '../_lib/models/User';
import Task from '../_lib/models/Task';
import Withdrawal from '../_lib/models/Withdrawal';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalTasks = await Task.countDocuments({});
    
    const earningsAggr = await User.aggregate([
      { $match: { role: 'user' } },
      { $group: { _id: null, total: { $sum: '$totalEarnings' } } }
    ]);
    const totalEarnings = earningsAggr.length > 0 ? earningsAggr[0].total : 0;

    const withdrawalsAggr = await Withdrawal.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const pendingWithdrawals = withdrawalsAggr.length > 0 ? withdrawalsAggr[0].total : 0;

    return res.status(200).json({
      totalUsers,
      totalTasks,
      totalEarnings,
      pendingWithdrawals
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
