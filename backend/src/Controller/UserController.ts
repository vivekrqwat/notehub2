
import { NextFunction, Request, Response } from "express";
import EmailAuth from "./EmailAuth";
import UserModel from "../Model/UserSchema";
const UserReg=async(req:Request,res:Response)=>{
    const{email,password}=req.body
  
    if(!email|| !password) return res.json({message:"wrong crendential"})
          const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered." });
    }
        const body={
    email:email,
    password:password
}
        const data= new UserModel(body);
        const savedData=await data.save();
        console.log(savedData)
        return res.status(200).json(savedData)

}
export default UserReg
