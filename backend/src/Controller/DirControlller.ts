import { Request, Response } from "express"
import setResponse from "../utils/ResponseHandler"
import Messages from "../Config/Messages"
import { DirModel } from "../Model/DirSchema"
import { QueryOptions } from "mongoose"

export const CreateDir=async(req:Request,res:Response)=>{
     console.log("hk")
    const{name,uid}=req.body
    if(!name||!uid)return setResponse(res,Messages.WrongCred,404)
        const body={
    name:name,
    uid:uid
}
        await DirModel.create(body)



    return setResponse(res,"DirCreated",200)
}
export const GetDir=async(req:Request,res:Response)=>{
    console.log("helo")
    const{id}=req.params
    if(!id)return setResponse(res,Messages.WrongCred,404)
    const Dirdata=await DirModel.find({uid:id}).sort().lean();
    if(!Dirdata)return setResponse(res,Messages.Nouser,404)
        return setResponse(res,Dirdata,200)
    

}
export const UpdateDir=async(req:Request,res:Response)=>{
    const {id}=req.params as {id:string}
    if(!id)return setResponse(res,Messages.WrongCred,404)
        const userdata=await DirModel.findById({_id:id}).lean()
    if(!userdata)return setResponse(res,Messages.Nouser,404)

        const {name,uid}=req.body
        const updatebody={
            $set:{
            name:name,uid:uid
            }
        }
        const option: QueryOptions = {
        returnDocument: 'after', 
        runValidators: true
    };
       const updatedoc= await DirModel.findByIdAndUpdate({_id:id},updatebody,option)

       return setResponse(res,updatedoc,200)
        

}