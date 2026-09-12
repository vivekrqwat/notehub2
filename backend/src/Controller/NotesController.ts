import { Request, Response } from "express";
import setResponse from "../utils/ResponseHandler";
import Messages from "../Config/Messages";
import { NotesModel } from "../Model/Notes";

export const CreateNotes=async(req:Request,res:Response)=>{
      const { id } = req.params as { id: string };
    const{title,desc}=req.body
    const dirid=id;
    if(!dirid)return setResponse(res,Messages.WrongCred,404)
        const notesObj={
    title:title,
    desc:desc,
    dirid:id
    }
   const notesdata= await NotesModel.create(notesObj)
   return setResponse(res,notesdata,200);

}
