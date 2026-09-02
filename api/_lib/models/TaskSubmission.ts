import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  taskId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  platform: string;
  taskType: string;
  screenshotUrl?: string;
  status: string;
  adminNotes?: string;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId;
  verificationDeadline?: Date;
  estimatedApprovalDate?: Date;
}

const TaskSubmissionSchema = new Schema<ITaskSubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  platform: { type: String },
  taskType: { type: String },
  screenshotUrl: { type: String },
  status: { type: String, enum: ['pending', 'under_review', 'approved', 'rejected'], default: 'under_review' },
  adminNotes: { type: String },
  submittedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  verificationDeadline: { type: Date },
  estimatedApprovalDate: { type: Date },
}, { timestamps: true });

// Compound index: one submission per company+platform+taskType per user
TaskSubmissionSchema.index({ userId: 1, companyId: 1, platform: 1, taskType: 1 }, { unique: true });

export default mongoose.models.TaskSubmission || mongoose.model<ITaskSubmission>('TaskSubmission', TaskSubmissionSchema);
