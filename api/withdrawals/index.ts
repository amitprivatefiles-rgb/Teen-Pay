import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import Withdrawal from '../_lib/models/Withdrawal';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      let withdrawals;
      if (user.role === 'admin') {
        withdrawals = await Withdrawal.find().populate('userId', 'name email').sort({ createdAt: -1 });
      } else {
        withdrawals = await Withdrawal.find({ userId: user._id }).sort({ createdAt: -1 });
      }
      return res.status(200).json(withdrawals);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      const { amount, upiId } = req.body;
      
      const dbUser = await User.findById(user._id);
      if (!dbUser || dbUser.totalEarnings < amount || amount < 100) {
        return res.status(400).json({ error: 'Insufficient balance or amount < 100' });
      }

      dbUser.totalEarnings -= amount;
      await dbUser.save();

      const withdrawal = await Withdrawal.create({
        userId: user._id,
        amount,
        upiId,
        status: 'pending'
      });
      return res.status(201).json(withdrawal);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
