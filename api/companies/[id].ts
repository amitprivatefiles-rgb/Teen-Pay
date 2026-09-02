import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../_lib/mongodb';
import { handleCors, requireAdmin } from '../../_lib/auth';
import Company from '../../_lib/models/Company';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  
  try {
    await connectDB();
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { id } = req.query;

    if (req.method === 'PUT') {
      const updatedCompany = await Company.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedCompany) return res.status(404).json({ message: 'Company not found' });
      return res.status(200).json(updatedCompany);
    } else if (req.method === 'PATCH') {
      const { active } = req.body;
      const updatedCompany = await Company.findByIdAndUpdate(id, { active }, { new: true });
      if (!updatedCompany) return res.status(404).json({ message: 'Company not found' });
      return res.status(200).json(updatedCompany);
    } else if (req.method === 'DELETE') {
      const deletedCompany = await Company.findByIdAndDelete(id);
      if (!deletedCompany) return res.status(404).json({ message: 'Company not found' });
      return res.status(200).json({ message: 'Company deleted successfully' });
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Company [id] error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
