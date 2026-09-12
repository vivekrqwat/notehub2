import express from "express"
import AsyncHandler from "../utils/AsyncHandler";
import { CreateNotes } from "../Controller/NotesController";

export const NotesRouter=express.Router();


NotesRouter.post("/creatnotes/:id",AsyncHandler(CreateNotes))