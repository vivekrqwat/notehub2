import { NextFunction, Request, Response } from "express"
import UserModel from "../Model/UserSchema"
import setResponse from "../utils/ResponseHandler"
import Messages from "../Config/Messages"

export const Autherization=async(role:string)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const id=req.body._id as string
        const user= await UserModel.findById({_id:id})
        if(!user)return setResponse(res,Messages.WrongCred,404)
        if(user.role==role)next();
        else{
            return setResponse(res,Messages.WrongCred,404)
        }

    }
}