import type { VercelRequest, VercelResponse } from '@vercel/node';
import { connectDB } from '../_lib/mongodb';
import { handleCors, requireAuth } from '../_lib/auth';
import GuestTaskSubmission from '../_lib/models/GuestTaskSubmission';
import User from '../_lib/models/User';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;
  await connectDB();
  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const user = await requireAuth(req, res);
      if (!user) return;
      if (user.role !== 'admin' && user.role !== 'company') return res.status(403).json({ error: 'Forbidden' });

      const { status, adminNotes } = req.body;
      const submission = await GuestTaskSubmission.findById(id);
      if (!submission) return res.status(404).json({ error: 'Not found' });

      submission.status = status;
      if (adminNotes) submission.adminNotes = adminNotes;
      
      if (status === 'approved') {
        const guestUser = await User.findOne({ email: submission.guestEmail });
        if (guestUser) {
          await User.findByIdAndUpdate(guestUser._id, { $inc: { totalEarnings: submission.rewardAmount } });
          submission.creditedToUserId = guestUser._id;
          submission.creditedAt = new Date();
        }
      } else if (status === 'rejected' && !adminNotes) {
        return res.status(400).json({ error: 'adminNotes required when rejecting' });
      }

      await submission.save();
      return res.status(200).json(submission);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
