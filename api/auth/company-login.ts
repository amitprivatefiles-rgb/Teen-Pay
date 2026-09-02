import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/mongodb';
import { handleCors, generateToken } from '../_lib/auth';
import CompanyUser from '../_lib/models/CompanyUser';
import Company from '../_lib/models/Company';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const companyUser = await CompanyUser.findOne({ email: email.toLowerCase().trim() }).populate('companyId');
    if (!companyUser) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, companyUser.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken({ _id: companyUser._id.toString(), email: companyUser.email, role: 'company', name: companyUser.name });

    const userData = companyUser.toObject();
    delete userData.passwordHash;

    return res.status(200).json({
      token,
      user: userData,
    });
  } catch (error: any) {
    console.error('Company Login error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
