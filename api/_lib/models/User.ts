import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  age?: number;
  phone?: string;
  role: 'user' | 'admin';
  totalEarnings: number;
  dailyEarnings: number;
  suspended: boolean;
  suspendedAt?: Date;
  suspendedBy?: mongoose.Types.ObjectId;
  suspensionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  name: { type: String, default: 'User' },
  age: { type: Number, min: 1, max: 120 },
  phone: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  totalEarnings: { type: Number, default: 0 },
  dailyEarnings: { type: Number, default: 0 },
  suspended: { type: Boolean, default: false },
  suspendedAt: { type: Date },
  suspendedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  suspensionReason: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
