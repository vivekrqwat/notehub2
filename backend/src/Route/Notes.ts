import express from "express"
import AsyncHandler from "../utils/AsyncHandler";
import { CreateNotes, GetNotes } from "../Controller/NotesController";

export const NotesRouter=express.Router();


NotesRouter.post("/:id",AsyncHandler(CreateNotes))
NotesRouter.get("/:id",AsyncHandler(GetNotes))
