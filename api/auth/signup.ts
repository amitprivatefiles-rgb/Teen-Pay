import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/mongodb';
import { handleCors, generateToken } from '../_lib/auth';
import User from '../_lib/models/User';
import GuestTaskSubmission from '../_lib/models/GuestTaskSubmission';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const { email, password, name, age } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(409).json({ message: 'User with this email already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const role = email.toLowerCase().trim() === 'admin@teenpay.com' ? 'admin' : 'user';

    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name || 'User',
      age: age || null,
      role,
    });

    // Auto-credit pending guest rewards
    const pendingGuestSubs = await GuestTaskSubmission.find({
      guestEmail: user.email,
      status: 'approved',
      creditedToUserId: null,
    });

    if (pendingGuestSubs.length > 0) {
      const totalReward = pendingGuestSubs.reduce((sum: number, s: any) => sum + s.rewardAmount, 0);
      await User.findByIdAndUpdate(user._id, { $inc: { totalEarnings: totalReward } });
      await GuestTaskSubmission.updateMany(
        { guestEmail: user.email, status: 'approved', creditedToUserId: null },
        { $set: { creditedToUserId: user._id, creditedAt: new Date() } }
      );
    }

    const token = generateToken({ _id: user._id.toString(), email: user.email, role: user.role, name: user.name });

    return res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, age: user.age, role: user.role, totalEarnings: user.totalEarnings, dailyEarnings: user.dailyEarnings, createdAt: user.createdAt },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
