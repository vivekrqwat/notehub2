import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import { DeleteImage, GetImages, UploadImage } from "../Controller/ImagesController";
import { uploadImageMiddleware } from "../Midllerware/UploadImage";

const ImagesRouter = express.Router();

ImagesRouter.post(
  "/:notesid",
  uploadImageMiddleware.single("image"),
  AsyncHandler(UploadImage),
);
ImagesRouter.get("/:notesid", AsyncHandler(GetImages));
ImagesRouter.delete("/:imageid", AsyncHandler(DeleteImage));

export default ImagesRouter;