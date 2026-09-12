import express from "express"
import AsyncHandler from "../utils/AsyncHandler"
import { CreateDir, GetDir, UpdateDir } from "../Controller/DirControlller"
const DirRouter=express.Router()

DirRouter.post("/dir/",AsyncHandler(CreateDir))
DirRouter.get("/:id",AsyncHandler(GetDir))
DirRouter.put("/:id",AsyncHandler(UpdateDir))


export default DirRouter