import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import Withdrawal from '../_lib/models/Withdrawal';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const user = await requireAdmin(req, res);
      if (!user) return;
      
      const { status } = req.body;
      const withdrawal = await Withdrawal.findById(id);
      if (!withdrawal) return res.status(404).json({ error: 'Not found' });

      withdrawal.status = status;
      withdrawal.processedAt = new Date();

      if (status === 'rejected') {
        await User.findByIdAndUpdate(withdrawal.userId, { $inc: { totalEarnings: withdrawal.amount } });
      }

      await withdrawal.save();
      return res.status(200).json(withdrawal);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
