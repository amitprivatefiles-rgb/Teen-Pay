import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors } from '../_lib/auth';
import GuestTaskSubmission from '../_lib/models/GuestTaskSubmission';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { taskId, email } = req.query;
      const submission = await GuestTaskSubmission.findOne({ taskId, guestEmail: email });
      if (submission) {
        return res.status(200).json({ exists: true, status: submission.status });
      }
      return res.status(200).json({ exists: false });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
