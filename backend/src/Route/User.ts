import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import EmailAuth from "../Controller/EmailAuth";
import  { UserLogin, UserReg } from "../Controller/UserController";

const UserRouter=express.Router()

UserRouter.post("/",AsyncHandler(EmailAuth))
UserRouter.post("/reg1",AsyncHandler(UserReg))
UserRouter.post("/login",AsyncHandler(UserLogin))
export default UserRouter