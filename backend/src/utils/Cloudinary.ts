import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = (buffer: Buffer) => new Promise<{
  secure_url: string;
  public_id: string;
}>((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    { folder: "notehub" },
    (error, result) => {
      if (error || !result) {
        reject(error || new Error("Cloudinary upload failed"));
        return;
      }
      resolve({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    },
  );

  stream.end(buffer);
});

export const deleteImage = (publicId: string) =>
  cloudinary.uploader.destroy(publicId, { resource_type: "image" });