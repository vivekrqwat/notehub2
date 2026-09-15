import express from "express"
import AsyncHandler from "../utils/AsyncHandler"
import { CreateDir, DeleteAllDir, DeleteDirByID, GetDir, getSomeDir, UpdateDir } from "../Controller/DirControlller"
import { AuthCheck } from "../Midllerware/Authcheck"
const DirRouter=express.Router()

DirRouter.post("/dir/",AuthCheck,AsyncHandler(CreateDir))
DirRouter.get("/:id",AsyncHandler(GetDir))
DirRouter.put("/:id",AuthCheck,AsyncHandler(UpdateDir))
DirRouter.get("/",AsyncHandler(getSomeDir))
DirRouter.delete("/:id",AuthCheck,AsyncHandler(DeleteDirByID))
DirRouter.delete("/",AuthCheck,AsyncHandler(DeleteAllDir))


export default DirRouter