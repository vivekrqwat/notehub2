import { Request, Response } from "express";
import mongoose from "mongoose";
import { ImagesModel } from "../Model/ImagesSchema";
import { NotesModel } from "../Model/Notes";
import { deleteImage, uploadImage } from "../utils/Cloudinary";
import setResponse from "../utils/ResponseHandler";

export const UploadImage = async (req: Request, res: Response) => {
  const { notesid } = req.params as { notesid: string };

  if (!mongoose.Types.ObjectId.isValid(notesid)) {
    return setResponse(res, "Invalid notes id", 400);
  }
  if (!req.file) {
    return setResponse(res, "Image file is required", 400);
  }

  const note = await NotesModel.exists({ _id: notesid });
  if (!note) {
    return setResponse(res, "Note not found", 404);
  }

  const uploadedImage = await uploadImage(req.file.buffer);

  try {
    const image = await ImagesModel.create({
      imagename: req.file.originalname,
      imageurl: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
      notesid,
    });
    return setResponse(res, image, 201);
  } catch (error) {
    await deleteImage(uploadedImage.public_id).catch(() => undefined);
    throw error;
  }
};

export const GetImages = async (req: Request, res: Response) => {
  const { notesid } = req.params as { notesid: string };

  if (!mongoose.Types.ObjectId.isValid(notesid)) {
    return setResponse(res, "Invalid notes id", 400);
  }

  const images = await ImagesModel.find({ notesid }).sort({ createdAt: -1 });
  return setResponse(res, images, 200);
};

export const DeleteImage = async (req: Request, res: Response) => {
  const { imageid } = req.params as { imageid: string };

  if (!mongoose.Types.ObjectId.isValid(imageid)) {
    return setResponse(res, "Invalid image id", 400);
  }

  const image = await ImagesModel.findById(imageid);
  if (!image) {
    return setResponse(res, "Image not found", 404);
  }

  await deleteImage(image.public_id);
  await ImagesModel.findByIdAndDelete(imageid);
  return setResponse(res, { message: "Image deleted" }, 200);
};
