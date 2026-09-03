import express from "express"
import AsyncHandler from "../utlis/AsyncHandler";
import EmailAuth from "../controller/EmailAuth";
const EmailRouter=express.Router();
EmailRouter.post("/",AsyncHandler(EmailAuth))

export default EmailRouter