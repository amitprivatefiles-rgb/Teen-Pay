import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  description?: string;
  logoUrl?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  description: { type: String },
  logoUrl: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema);
