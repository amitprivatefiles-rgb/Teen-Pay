import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth, requireAdmin } from '../_lib/auth';
import Withdrawal from '../_lib/models/Withdrawal';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const id = (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id) as string | undefined;

  try {
    if (req.method === 'GET') {
      if (!id) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        if (user.role === 'admin') {
          const withdrawals = await Withdrawal.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
          return res.status(200).json(withdrawals);
        } else {
          const withdrawals = await Withdrawal.find({ userId: user._id })
            .sort({ createdAt: -1 });
          return res.status(200).json(withdrawals);
        }
      } else {
        const user = await requireAuth(req, res);
        if (!user) return;
        const withdrawal = await Withdrawal.findById(id).populate('userId', 'name email');
        if (!withdrawal) return res.status(404).json({ error: 'Not found' });
        if (user.role !== 'admin' && withdrawal.userId._id.toString() !== user._id.toString()) {
          return res.status(403).json({ error: 'Forbidden' });
        }
        return res.status(200).json(withdrawal);
      }
    } else if (req.method === 'POST') {
      if (!id) {
        const user = await requireAuth(req, res);
        if (!user) return;
        
        const { amount, upiId } = req.body;
        
        const dbUser = await User.findById(user._id);
        if (!dbUser || dbUser.totalEarnings < amount || amount < 100) {
          return res.status(400).json({ error: 'Invalid amount' });
        }
        
        await User.findByIdAndUpdate(user._id, {
          $inc: { totalEarnings: -amount }
        });
        
        const withdrawal = new Withdrawal({
          userId: user._id,
          amount,
          upiId,
          status: 'pending'
        });
        await withdrawal.save();
        
        return res.status(201).json(withdrawal);
      }
    } else if (req.method === 'PUT') {
      if (id) {
        const user = await requireAdmin(req, res);
        if (!user) return;
        
        const { status } = req.body;
        if (status !== 'completed' && status !== 'rejected') {
          return res.status(400).json({ error: 'Invalid status' });
        }
        
        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) return res.status(404).json({ error: 'Not found' });
        
        withdrawal.status = status;
        withdrawal.processedAt = new Date();
        await withdrawal.save();
        
        if (status === 'rejected') {
          await User.findByIdAndUpdate(withdrawal.userId, {
            $inc: { totalEarnings: withdrawal.amount }
          });
        }
        
        return res.status(200).json(withdrawal);
      }
    }
    
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
