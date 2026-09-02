import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../../_lib/mongodb';
import { handleCors, requireAdmin } from '../../_lib/auth';
import CompanyUser from '../../_lib/models/CompanyUser';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  if (req.method !== 'DELETE') return res.status(405).json({ message: 'Method not allowed' });

  try {
    await connectDB();
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const { id } = req.query;
    const deletedUser = await CompanyUser.findByIdAndDelete(id);
    
    if (!deletedUser) return res.status(404).json({ message: 'Company user not found' });
    
    return res.status(200).json({ message: 'Company user deleted successfully' });
  } catch (error: any) {
    console.error('Delete company user error:', error);
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
}
