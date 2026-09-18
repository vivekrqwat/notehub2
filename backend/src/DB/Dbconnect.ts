import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

export const DbConnect = async (): Promise<void> => {
  if (!MONGO_URI) {
    console.error(
      "Critical Error: MONGO_URI environment variable is not defined.",
    );
    process.exit(1);
  }
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};
