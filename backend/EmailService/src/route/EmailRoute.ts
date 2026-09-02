import express from "express"
import AsyncHandler from "../utlis/AsyncHandler";
const EmailRouter=express.Router();
EmailRouter.post("/",AsyncHandler())

export default EmailRouter