import mongoose from "mongoose";
import { OTP } from "../Interfaces/Interface";
const Schema = mongoose.Schema;
const OtpSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  otp: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Time in seconds (300 seconds = 5 minutes)
  },
});
export const Otpmodel = mongoose.model<OTP>("OTPSCHEMA", OtpSchema);
