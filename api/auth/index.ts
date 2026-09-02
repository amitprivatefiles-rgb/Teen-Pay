import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth, generateToken } from '../_lib/auth';
import User from '../_lib/models/User';
import CompanyUser from '../_lib/models/CompanyUser';
import Company from '../_lib/models/Company';
import GuestTaskSubmission from '../_lib/models/GuestTaskSubmission';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();
  void Company;

  const { action } = req.query;
  const actionPath = Array.isArray(action) ? action[0] : action;

  try {
    if (req.method === 'POST' && actionPath === 'signup') {
      const { email, password, name } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already in use' });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const role = email === 'admin@teenpay.com' ? 'admin' : 'user';

      const newUser = new User({ email, passwordHash, name, role });
      await newUser.save();

      const guestSubmissions = await GuestTaskSubmission.find({ email, status: 'approved', creditedToUserId: null });
      let totalGuestRewards = 0;
      for (const sub of guestSubmissions) {
        totalGuestRewards += sub.reward || 0;
        sub.creditedToUserId = newUser._id;
        await sub.save();
      }

      if (totalGuestRewards > 0) {
        newUser.totalEarnings = (newUser.totalEarnings || 0) + totalGuestRewards;
        await newUser.save();
      }

      const token = generateToken(newUser);
      const userObj = newUser.toObject();
      delete userObj.passwordHash;
      return res.status(201).json({ token, user: userObj });
    }

    if (req.method === 'POST' && actionPath === 'login') {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = generateToken(user);
      const userObj = user.toObject();
      delete userObj.passwordHash;
      return res.status(200).json({ token, user: userObj });
    }

    if (req.method === 'POST' && actionPath === 'company-login') {
      const { email, password } = req.body;
      const companyUser = await CompanyUser.findOne({ email }).populate('companyId');
      if (!companyUser) return res.status(401).json({ error: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, companyUser.passwordHash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = generateToken({ _id: companyUser._id, role: 'company' } as any);
      const userObj = companyUser.toObject();
      delete userObj.passwordHash;
      return res.status(200).json({ token, user: userObj });
    }

    if (req.method === 'GET' && actionPath === 'me') {
      const authUser = await requireAuth(req, res);
      if (!authUser) return;

      if (authUser.role === 'company') {
        const companyUser = await CompanyUser.findById(authUser._id).populate('companyId');
        if (!companyUser) return res.status(404).json({ error: 'User not found' });
        const userObj = companyUser.toObject();
        delete userObj.passwordHash;
        return res.status(200).json({ user: userObj });
      } else {
        const user = await User.findById(authUser._id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const userObj = user.toObject();
        delete userObj.passwordHash;
        return res.status(200).json({ user: userObj });
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
