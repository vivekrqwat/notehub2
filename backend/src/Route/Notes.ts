import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import {
  CreateNotes,
  DeletAllNOtes,
  DeletNOtesById,
  getAllNotes,
  GetNotes,
  UpdateNotes,
} from "../Controller/NotesController";
import { AuthCheck } from "../Midllerware/Authcheck";

export const NotesRouter = express.Router();

NotesRouter.post("/:id", AuthCheck, AsyncHandler(CreateNotes));
NotesRouter.get("/:id", AuthCheck, AsyncHandler(GetNotes));
NotesRouter.get("/", getAllNotes);
NotesRouter.put("/:id",AuthCheck,AsyncHandler(UpdateNotes))
NotesRouter.delete("/:id", AuthCheck, AsyncHandler(DeletNOtesById));
NotesRouter.delete("/", AuthCheck, AsyncHandler(DeletAllNOtes));
