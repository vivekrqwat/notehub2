import express from "express"
import AsyncHandler from "../utils/AsyncHandler";
import { CreateNotes, getAllNotes, GetNotes } from "../Controller/NotesController";

export const NotesRouter=express.Router();


NotesRouter.post("/:id",AsyncHandler(CreateNotes))
NotesRouter.get("/:id",AsyncHandler(GetNotes))
NotesRouter.get("/",getAllNotes)