import { Request, Response } from "express";
import setResponse from "../utils/ResponseHandler";
import Messages from "../Config/Messages";
import { DirModel } from "../Model/DirSchema";
import mongoose, { QueryOptions } from "mongoose";
import { getPaginationOptions } from "../utils/PaginationQuery";
import { NotesModel } from "../Model/Notes";

export const CreateDir = async (req: Request, res: Response) => {
  console.log("hk");
  const { uid,name } = req.body;
   if (!mongoose.Types.ObjectId.isValid(uid)) {
    return res.status(400).json({ error: "Invalid User/Directory ID format." });
  }

  if (!name || !uid) return setResponse(res, Messages.WrongCred, 404);
  const body = {
    name:name,
    uid:uid,
  };
    console.log("name:",name,"uid",uid)
  await DirModel.create(req.body);

  return setResponse(res, "DirCreated", 200);
};
export const GetDir = async (req: Request, res: Response) => {
  console.log("helo");
  const { id } = req.params;
  if (!id) return setResponse(res, Messages.WrongCred, 404);
  const Dirdata = await DirModel.find({ uid: id }).sort().lean();
  if (!Dirdata) return setResponse(res, Messages.Nouser, 404);
  
  return setResponse(res, Dirdata, 200);
};

export const getSomeDir = async (req: Request, res: Response) => {
  const limit = 10;
  const Dirdata = await DirModel.aggregate([
    {
      $lookup: {
        from: "notes",
        localField: "_id",
        foreignField: "dirid",
        as: "notes",
      },
    },
    {
      $project: {
        "notes.dirid": 0,
      },
    },
    {
      $limit: limit,
    },
  ]);
  return setResponse(res, Dirdata, 200);
};

export const UpdateDir = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  if (!id) return setResponse(res, Messages.WrongCred, 404);
  const userdata = await DirModel.findById({ _id: id }).lean();
  if (!userdata) return setResponse(res, Messages.Nouser, 404);

  const { name, uid } = req.body;
  const updatebody = {
    $set: {
      name: name,
      uid: uid,
    },
  };
  const option: QueryOptions = {
    returnDocument: "after",
    runValidators: true,
  };
  const updatedoc = await DirModel.findByIdAndUpdate(
    { _id: id },
    updatebody,
    option,
  );

  return setResponse(res, updatedoc, 200);
};

export const DeleteDirByID = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    return setResponse(res, Messages.WrongCred, 404);
  const deleteDir = await DirModel.findByIdAndDelete({ _id: id });
  const deletenotes = await NotesModel.findByIdAndDelete({ dirid: id });
  const message = "deleted dir";
  return setResponse(res, message, 200);
};

export const DeleteAllDir = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  if (!id || !mongoose.Types.ObjectId.isValid(id))
    return setResponse(res, Messages.WrongCred, 404);
  const deleteDir = await DirModel.deleteMany({ _id: id });

  if (deleteDir.deletedCount == 0)
    return setResponse(res, Messages.Nouser, 404);

  const messages = {
    msg: "deleted",
    data: {
      deletcouont: deleteDir.deletedCount,
    },
  };
  return setResponse(res, messages, 200);
};
