import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAdmin, getAuthUser } from '../_lib/auth';
import Company from '../_lib/models/Company';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  const id = (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id) as string | undefined;

  try {
    if (req.method === 'GET') {
      if (id) {
        const company = await Company.findById(id);
        if (!company) return res.status(404).json({ error: 'Not found' });
        return res.json(company);
      }
      const authUser = await getAuthUser(req);
      if (authUser?.role === 'admin') {
        const companies = await Company.find({}).sort({ createdAt: -1 });
        return res.json(companies);
      } else {
        const companies = await Company.find({ active: true }).sort({ name: 1 });
        return res.json(companies);
      }
    }

    if (req.method === 'POST' && !id) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const company = new Company(req.body);
      await company.save();
      return res.status(201).json(company);
    }

    if (req.method === 'PUT' && id) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const company = await Company.findByIdAndUpdate(id, req.body, { new: true });
      if (!company) return res.status(404).json({ error: 'Not found' });
      return res.json(company);
    }

    if (req.method === 'PATCH' && id) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const company = await Company.findById(id);
      if (!company) return res.status(404).json({ error: 'Not found' });
      company.active = !company.active;
      await company.save();
      return res.json(company);
    }

    if (req.method === 'DELETE' && id) {
      const admin = await requireAdmin(req, res);
      if (!admin) return;

      const company = await Company.findByIdAndDelete(id);
      if (!company) return res.status(404).json({ error: 'Not found' });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
