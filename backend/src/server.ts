import express, { NextFunction, Request, Response } from "express";
import Config from "./Config/AllPath";
import dotenv from "dotenv";
import UserRouter from "./Route/User";
import DirRouter from "./Route/Dir";
import { NotesRouter } from "./Route/Notes";
import TaskScheduleRouter from "./Route/TaskSchedule";
import ImagesRouter from "./Route/Images";
import { CheckandSendTask } from "./utils/CornJobs";
const app=express();
dotenv.config();
app.use(express.json());

//
const {Login_SignUP,Dir_Route,Notes_Route, Task_Route, Images_Route}=Config
console.log(Login_SignUP)
app.use(Login_SignUP, UserRouter)
app.use(Dir_Route,DirRouter)
app.use(Notes_Route,NotesRouter)
app.use( Task_Route,TaskScheduleRouter)
app.use(Images_Route, ImagesRouter)

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const errorData = error as {
    message?: string;
    error?: { message?: string };
  };
  const message = errorData?.error?.message || errorData?.message || "Request failed";

  console.error("Request error:", error);
  return res.status(500).json({
    status: "fail",
    message,
  });
});
CheckandSendTask()

export default app;