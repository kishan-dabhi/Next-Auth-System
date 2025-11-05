// lib/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  verified?: boolean;
  otp?: string;
  otpExpiresAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
