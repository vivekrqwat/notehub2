import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import setResponse from "../utils/ResponseHandler";
import Messages from "../Config/Messages";
import UserModel from "../Model/UserSchema";
import { Schema } from "mongoose";
dotenv.config();
export interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with your actual User payload type if available
}
interface Decoded{
    id:Schema.Types.ObjectId,
    email:String
}
export const AuthCheck=async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try{
        
        const authHeader = req.headers.authorization;
        console.log(authHeader)
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return setResponse(res, Messages.WrongCred, 401);
    }
    
    const token = authHeader.split(" ")[1];
    console.log("token",token)
    console.log(process.env.KEY)
     const decoded = jwt.verify(token,"sam#123");
   console.log(decoded)
       

     req.user=decoded;

     next();
        


    }catch(e){
        console.log(e)
              return setResponse(res, Messages.WrongCred, 401);
    }
}