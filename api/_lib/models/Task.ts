import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  companyId: mongoose.Types.ObjectId;
  platform: string;
  taskType: string;
  taskLink?: string;
  googleProfileLink?: string;
  reviewText?: string;
  starRating?: number;
  rewardAmount: number;
  maxUsers: number;
  active: boolean;
  completed: boolean;
  shareable: boolean;
  createdByCompanyUser?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: { type: String, required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  platform: { type: String, enum: ['google', 'instagram', 'youtube', 'playstore', 'voting'], required: true },
  taskType: { type: String, enum: ['review', 'comment', 'like', 'follow', 'subscribe', 'install_review', 'vote'], required: true },
  taskLink: { type: String },
  googleProfileLink: { type: String },
  reviewText: { type: String },
  starRating: { type: Number, min: 1, max: 5 },
  rewardAmount: { type: Number, default: 10 },
  maxUsers: { type: Number, default: 50 },
  active: { type: Boolean, default: true },
  completed: { type: Boolean, default: false },
  shareable: { type: Boolean, default: false },
  createdByCompanyUser: { type: Schema.Types.ObjectId, ref: 'CompanyUser' },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
