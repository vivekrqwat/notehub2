import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import EmailAuth from "../Controller/EmailAuth";
import  { SendOtp, UserLogin, UserReg, VerifyOtp } from "../Controller/UserController";
import EmailOtp from "../Controller/EmailAuth";
import CheckEmail from "../Controller/EmailAuth";

const UserRouter=express.Router()

UserRouter.post("/otp-handler",AsyncHandler(SendOtp))
UserRouter.post("/verify",AsyncHandler(VerifyOtp))
UserRouter.post("/reg1",AsyncHandler(UserReg))
UserRouter.post("/login",AsyncHandler(UserLogin))
export default UserRouter