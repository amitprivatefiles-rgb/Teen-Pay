import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import CompanyUser from '../_lib/models/CompanyUser';
import Company from '../_lib/models/Company';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    await connectDB();
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    if (req.method === 'GET') {
      const users = await CompanyUser.find({}).populate('companyId');
      return res.status(200).json(users);
    } else if (req.method === 'POST') {
      const { companyId, email, password, name } = req.body;
      if (!email || !password || !companyId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const newCompanyUser = await CompanyUser.create({ companyId, email: email.toLowerCase().trim(), passwordHash, name });
      
      const userData = newCompanyUser.toObject();
      delete userData.passwordHash;
      return res.status(201).json(userData);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Company users error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
