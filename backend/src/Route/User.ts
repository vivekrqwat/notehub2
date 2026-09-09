import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import EmailAuth from "../Controller/EmailAuth";
import UserReg from "../Controller/UserController";

const UserRouter=express.Router()

UserRouter.post("/",AsyncHandler(EmailAuth))
UserRouter.post("/reg1",AsyncHandler(UserReg))
export default UserRouter