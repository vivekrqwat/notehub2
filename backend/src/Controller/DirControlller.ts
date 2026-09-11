import { Request, Response } from "express"
import setResponse from "../utils/ResponseHandler"
import Messages from "../Config/Messages"
import { DirModel } from "../Model/DirSchema"

export const CreateDir=async(req:Request,res:Response)=>{
    const{name,uid}=req.body
    if(!name||!uid)return setResponse(res,Messages.WrongCred,404)
        const body={
    name:name,
    uid:uid
}
        await DirModel.create(body)
        


    return setResponse(res,"DirCreated",200)
}