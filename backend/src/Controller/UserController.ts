
import { NextFunction, Request, Response } from "express";
import EmailAuth from "./EmailAuth";
import UserModel from "../Model/UserSchema";
import bcrypt from "bcryptjs";
import Messages from '../Config/Messages';
import setResponse from "../utils/ResponseHandler";
import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv";
import dotenv from "dotenv";

export const UserReg=async(req:Request,res:Response)=>{
    const{email,password}=req.body
  
    if(!email|| !password) return setResponse(res,Messages.WrongCred,404)
          const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message:Messages.User });
    }
    const salt = bcrypt.genSaltSync(10);
const hashedpassword = bcrypt.hashSync(password, salt);
        const body={
    email:email,
    password:hashedpassword
}
        const data= new UserModel(body);
        const savedData=await data.save();
        console.log(savedData)
        return setResponse(res,savedData,200)

}
dotenv.config();


export const UserLogin=async(req:Request,res:Response)=>{
    console.log("kl")
    if(!process.env.KEY)return setResponse(res,Messages.ENV,505)
    const{email,password}=req.body
    if(!email||!password)return res.json({message:Messages.WrongCred})
    const userdata=await UserModel.findOne({email:email})
    if(!userdata)return res.json({message:Messages.WrongCred})
        const Match=await bcrypt.compare(password,userdata.password)
    if(!Match)return setResponse(res,Messages.WrongCred,404)
       const data=await UserModel.findOne({email:email}).select('-password')
        const obj={id:data?._id,email:data?.email}
        const token= jwt.sign({obj},process.env.KEY,{ expiresIn: '1h' })

        return res.json(token)

}

