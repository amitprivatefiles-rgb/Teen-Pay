import mongoose, { Schema, Document } from 'mongoose';

export interface IGuestTaskSubmission extends Document {
  taskId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  guestEmail: string;
  platform: string;
  taskType: string;
  screenshotUrl?: string;
  status: string;
  rewardAmount: number;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  adminNotes?: string;
  creditedToUserId?: mongoose.Types.ObjectId;
  creditedAt?: Date;
}

const GuestTaskSubmissionSchema = new Schema<IGuestTaskSubmission>({
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  guestEmail: { type: String, required: true, lowercase: true, trim: true },
  platform: { type: String },
  taskType: { type: String },
  screenshotUrl: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rewardAmount: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId },
  adminNotes: { type: String },
  creditedToUserId: { type: Schema.Types.ObjectId, ref: 'User' },
  creditedAt: { type: Date },
}, { timestamps: true });

// One submission per email per task
GuestTaskSubmissionSchema.index({ guestEmail: 1, taskId: 1 }, { unique: true });

export default mongoose.models.GuestTaskSubmission || mongoose.model<IGuestTaskSubmission>('GuestTaskSubmission', GuestTaskSubmissionSchema);
