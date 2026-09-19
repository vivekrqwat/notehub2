import { Request, Response } from "express";
import setResponse from "../utils/ResponseHandler";
import Messages from "../Config/Messages";
import { NotesModel } from "../Model/Notes";
import { getPaginationOptions } from "../utils/PaginationQuery";
import mongoose from "mongoose";
import { CheckForTypeId } from "../utils/CheckforTypeId";
import { QueryOptions } from "mongoose";

export const CreateNotes = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
    console.log("notes:")
  const { title, desc, uid } = req.body;
  const dirid = id;

  if (!dirid) return setResponse(res, Messages.WrongCred, 404);
  const notesObj = {
    title: title,
    desc: desc,
    dirid: id,
    uid: uid,
  };
  console.log(notesObj)
  const notesdata = await NotesModel.create(notesObj);
  return setResponse(res, notesdata, 200);
};
export const GetNotes = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };

  const { page, limit, skip } = getPaginationOptions(req.query);

  const filter = { dirid: id };
  

  const [notes, totalnotes] = await Promise.all([
    NotesModel.find(filter).skip(skip).limit(limit).lean(),
    NotesModel.countDocuments(filter),
  ]);
  const noteObj = {
    items: notes,
    pagination: {
      totalItems: totalnotes,
      totalPages: Math.ceil(totalnotes / limit),
      currentPage: page,
      limit,
    },
  };

  return setResponse(res, noteObj, 200);
};

export const DeletAllNOtes = async (req: Request, res: Response) => {
  const { dirid } = req.body;
  if (!dirid) return setResponse(res, Messages.Nouser, 404);
  if (!mongoose.Types.ObjectId.isValid(dirid)) {
    return setResponse(res, Messages.Nouser, 404);
  }

  const delete1 = await NotesModel.deleteMany({ dirid: dirid });
  if (delete1.deletedCount == 0) {
    return setResponse(res, Messages.Nouser, 404);
  }
  const messages = {
    msg: "deleted",
    data: {
      deletcouont: delete1.deletedCount,
    },
  };
  return setResponse(res, messages, 200);
};

export const DeletNOtesById = async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) return setResponse(res, Messages.Nouser, 404);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return setResponse(res, Messages.Nouser, 404);
  }

  const delete1 = await NotesModel.findByIdAndDelete({ _id: id }).lean();

  const messages = {
    msg: "deleted",
  };
  return setResponse(res, messages, 200);
};

export const getAllNotes = async (req: Request, res: Response) => {
  const allNotes = await NotesModel.aggregate([
    {
      $sort: { title: 1 },
    },
    {
      $lookup: {
        from: "dirschemas",
        localField: "dirid",
        foreignField: "_id",
        as: "dir",
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "dir.uid",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        "user.password": 0,
        "user._id": 0,
        "dir._id": 0,
        "dir:uid": 0,
      },
    },
  ]);
  return setResponse(res, allNotes, 200);
};

export const UpdateNotes=async (req:Request,res:Response)=>{
  const {id}=req.params as {id:string};
  
  if(!CheckForTypeId(id))return setResponse(res,Messages.WrongCred,404)
    const updateData=await NotesModel.findById({_id:id}).lean();
  if(!updateData)return setResponse(res,Messages.WrongCred,404);
  const {title,desc}=req.body
  console.log("updatenotes",title,desc)
  const update={
    $set:{
    title:title,
    desc:desc
    }
  }
  const option: QueryOptions = {
      returnDocument: "after",
      runValidators: true,
    };

    const updateNOtes=await NotesModel.findByIdAndUpdate({_id:id},update,option)
    console.log("updated",updateNOtes)
    return setResponse(res,updateNOtes,200)



}
