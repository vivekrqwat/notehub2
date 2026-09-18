import { Request, Response } from "express";
import Messages from "../Config/Messages";
import setResponse from "../utils/ResponseHandler";
import { TaskModel } from "../Model/TaskScheduler";
import { getPaginationOptions } from "../utils/PaginationQuery";
import { QueryOptions } from "mongoose";

export const createSchedule = async (req: Request, res: Response) => {
  const { title, desc, email, Date, time, uid } = req.body;
  if (!uid || !email || !Date) return setResponse(res, Messages.WrongCred, 404);
  const ObjBody = { title, desc, email, Date, time, uid };

  const user = await TaskModel.create(ObjBody);
  return setResponse(res, user, 200);
};
export const GetSchedule = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { page, skip, limit } = getPaginationOptions(req.query);

  const data = await TaskModel.find({ _id: id })
    .skip(skip)
    .limit(limit)
    .sort()
    .lean();
  if (!data) setResponse(res, Messages.NoNOtes, 404);
  return setResponse(res, data, 200);
};
export const EditSchedule = async (req: Request, res: Response) => {
  const { id } = req.params as { id: string };
  const { title, desc, date } = req.body;
  const data = await TaskModel.find({ _id: id }).lean();
  if (!data) return setResponse(res, Messages.Nouser, 404);
  const filter = { _id: id };
  const updatebody = {
    $set: {
      title,
      desc,
      date,
    },
  };
  const options: QueryOptions = {
    returnDocument: "after",
    runValidators: true,
  };
  const Udata = await TaskModel.findByIdAndUpdate(filter, updatebody, options);

  return setResponse(res, Udata, 200);
};
export const DeleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = await TaskModel.find({ _id: id }).lean();
  if (!data) return setResponse(res, Messages.Nouser, 404);

  const deleted = await TaskModel.findByIdAndDelete({ _id: id });
  return setResponse(res, deleted, 404);
};
