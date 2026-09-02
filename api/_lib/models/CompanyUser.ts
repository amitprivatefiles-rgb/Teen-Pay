import mongoose, { Schema, Document } from 'mongoose';

export interface ICompanyUser extends Document {
  companyId: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanyUserSchema = new Schema<ICompanyUser>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'Company User' },
}, { timestamps: true });

export default mongoose.models.CompanyUser || mongoose.model<ICompanyUser>('CompanyUser', CompanyUserSchema);
