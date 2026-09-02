import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import User from '../_lib/models/User';
import CompanyUser from '../_lib/models/CompanyUser';
import Company from '../_lib/models/Company';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const authUser = await requireAuth(req, res);
    if (!authUser) return;

    if (authUser.role === 'company') {
      const companyUser = await CompanyUser.findById(authUser._id).populate('companyId');
      if (!companyUser) return res.status(404).json({ message: 'Company user not found' });
      const userData = companyUser.toObject();
      delete userData.passwordHash;
      return res.status(200).json(userData);
    } else {
      const user = await User.findById(authUser._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const userData = user.toObject();
      delete userData.passwordHash;
      return res.status(200).json(userData);
    }
  } catch (error: any) {
    console.error('Me error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
