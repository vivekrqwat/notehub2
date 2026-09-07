import express from "express";
import AsyncHandler from "../utils/AsyncHandler";
import EmailAuth from "../Controller/EmailAuth";

const UserRouter=express.Router()

UserRouter.post("/",AsyncHandler(EmailAuth))
export default UserRouter