import express from "express";
import Config from "./Config/AllPath";
import dotenv from "dotenv";
import UserRouter from "./Route/User";
import DirRouter from "./Route/Dir";
import { NotesRouter } from "./Route/Notes";
import TaskScheduleRouter from "./Route/TaskSchedule";
import { CheckandSendTask } from "./utils/CornJobs";
const app=express();
dotenv.config();
app.use(express.json());

//
const {Login_SignUP,Dir_Route,Notes_Route, Task_Route}=Config
console.log(Login_SignUP)
app.use(Login_SignUP, UserRouter)
app.use(Dir_Route,DirRouter)
app.use(Notes_Route,NotesRouter)
app.use( Task_Route,TaskScheduleRouter)

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
})
CheckandSendTask()

export default app;