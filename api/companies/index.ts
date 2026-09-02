import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin, getAuthUser } from '../_lib/auth';
import Company from '../_lib/models/Company';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  try {
    await connectDB();

    if (req.method === 'GET') {
      const user = await getAuthUser(req);
      const isAdmin = user && user.role === 'admin';

      if (isAdmin) {
        const companies = await Company.find({}).sort({ createdAt: -1 });
        return res.status(200).json(companies);
      } else {
        const activeCompanies = await Company.find({ active: true }).sort({ name: 1 });
        return res.status(200).json(activeCompanies);
      }
    } else if (req.method === 'POST') {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { name, description, logoUrl } = req.body;
      const newCompany = await Company.create({ name, description, logoUrl, active: true });
      return res.status(201).json(newCompany);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Companies error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
