import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import setResponse from "../utils/ResponseHandler";
import Messages from "../Config/Messages";

import { Schema } from "mongoose";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with your actual User payload type if available
}

interface Decoded {
  id: Schema.Types.ObjectId;
  email: String;
}

export const AuthCheck = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 1. Extract the token directly from the cookies object
    const token = req.cookies?.jwt;
    console.log("Token from cookie:", token);

    // 2. Check if the token exists
    if (!token) {
      return setResponse(res, Messages.WrongCred, 401);
    }

    // console.log("Secret Key:", process.env.KEY);
    
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.KEY || "");
    // console.log("Decoded payload:", decoded);

    // 4. Attach the decoded payload to the request object
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    return setResponse(res, Messages.WrongCred, 401);
  }
};
