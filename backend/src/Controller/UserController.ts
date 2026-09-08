
import { NextFunction, Request, Response } from "express";
import EmailAuth from "./EmailAuth";
import UserModel from "../Model/UserSchema";
const UserReg=async(req:Request,res:Response)=>{
    const{email,password}=req.body
  
    if(!email|| !password) return res.json({message:"wrong crendential"})
          const userdata=await UserModel.find({email:email})
        if(userdata)return res.json({message:"user already present"})
        const body={
    email:email,
    password:password
}
        const data=await new UserModel(body);
        const savedData=data.save();
        return res.status(200).json(savedData)

}
export default UserReg
