import express from "express"
import AsyncHandler from "../utils/AsyncHandler"
import { CreateDir, GetDir } from "../Controller/DirControlller"
const DirRouter=express.Router()

DirRouter.post("/createDir",AsyncHandler(CreateDir))
DirRouter.get("/getDir/:id",AsyncHandler(GetDir))


export default DirRouter