import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import {
  CreateNotes,
  DeletAllNOtes,
  DeletNOtesById,
  getAllNotes,
  GetNotes,
} from "../Controller/NotesController";
import { AuthCheck } from "../Midllerware/Authcheck";

export const NotesRouter = express.Router();

NotesRouter.post("/:id", AuthCheck, AsyncHandler(CreateNotes));
NotesRouter.get("/:id", AsyncHandler(GetNotes));
NotesRouter.get("/", getAllNotes);
NotesRouter.delete("/:id", AuthCheck, AsyncHandler(DeletNOtesById));
NotesRouter.delete("/", AuthCheck, AsyncHandler(DeletAllNOtes));
