import { Request, Response } from "express";
import setResponse from "../utils/ResponseHandler";
import Messages from "../Config/Messages";
import { NotesModel } from "../Model/Notes";
import { getPaginationOptions } from "../utils/PaginationQuery";

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
export const GetNotes=async(req:Request,res:Response)=>{
    const {id}=req.params as {id:string}
    
    const {page,limit,skip}=getPaginationOptions(req.query)

 const filter = { dirid: id };
 

    
   const [notes,totalnotes]=await Promise.all([
    NotesModel.find(filter).skip(skip).limit(limit).lean(),
    NotesModel.countDocuments(filter)
   ]) 
   if(!notes) return setResponse(res,Messages.NoNOtes,200);
   const noteObj={
    items:notes,
    pagination:{
          totalItems:totalnotes,
        totalPages: Math.ceil(totalnotes / limit),
        currentPage: page,
        limit
    }
   }

   return setResponse(res,notes,200);

   




}
