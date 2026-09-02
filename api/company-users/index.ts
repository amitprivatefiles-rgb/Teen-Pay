import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin } from '../_lib/auth';
import CompanyUser from '../_lib/models/CompanyUser';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const id = (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id) as string | undefined;

  try {
    if (req.method === 'GET' && !id) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const companyUsers = await CompanyUser.find({}, { passwordHash: 0 }).populate('companyId', 'name');
      return res.json(companyUsers);
    }

    if (req.method === 'POST' && !id) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const { companyId, email, password, name } = req.body;
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      const companyUser = new CompanyUser({ companyId, email, passwordHash, name });
      await companyUser.save();
      
      const userObj = companyUser.toObject();
      delete userObj.passwordHash;
      return res.status(201).json(userObj);
    }

    if (req.method === 'DELETE' && id) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const companyUser = await CompanyUser.findByIdAndDelete(id);
      if (!companyUser) return res.status(404).json({ error: 'Not found' });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
