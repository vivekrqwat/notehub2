import { NextFunction, Request, Response } from "express";
import UserModel from "../Model/UserSchema";
import setResponse from "../utils/ResponseHandler";
import Messages from "../Config/Messages";

interface AUtherizationRequest extends Request {
  user?: any;
}

export const Autherization = async (role: string) => {
  return (req: AUtherizationRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role == role) next();
    else {
      return setResponse(res, Messages.WrongCred, 404);
    }
  };
};
