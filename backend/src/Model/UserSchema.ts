import mongoose from "mongoose";
import { User } from "../Interfaces/Interface";
const Schema = mongoose.Schema;
const USER_SCHEMA = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilepic: { type: String },
    bgpic: { type: String },
    otp: { type: String },
    role: { type: String },
  },
  { timestamps: true },
);
//

const UserModel = mongoose.model<User>("User", USER_SCHEMA);
export default UserModel;
