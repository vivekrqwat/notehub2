import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import Config from "./Config/AllPath";
import dotenv from "dotenv";
import UserRouter from "./Route/User";
import DirRouter from "./Route/Dir";
import { NotesRouter } from "./Route/Notes";
import TaskScheduleRouter from "./Route/TaskSchedule";
import ImagesRouter from "./Route/Images";
import { CheckandSendTask } from "./utils/CornJobs";
import { AuthCheck, AuthenticatedRequest } from "./Midllerware/Authcheck";
import setResponse from "./utils/ResponseHandler";
import Messages from "./Config/Messages";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use((req, _res, next) => {
  console.log(`[API] ${req.method} ${req.originalUrl}`);
  next();
});

//
const { Login_SignUP, Dir_Route, Notes_Route, Task_Route, Images_Route } =
  Config;
console.log(Login_SignUP);
app.use(Login_SignUP, UserRouter);
app.use(Dir_Route, DirRouter);
app.use(Notes_Route, NotesRouter);
app.use(Task_Route, TaskScheduleRouter);
app.use(Images_Route, ImagesRouter);

app.use("/notehub/auth/me",AuthCheck,async(req:AuthenticatedRequest,res:Response)=>{
  try{

    console.log("user",req.user)
    const{id,email}=req.user
    console.log("id",id,email)
    if(!id||!email) return setResponse(res,Messages.WrongCred,404)

      return setResponse(res,{id:id,email:email},200)

  }catch(e){
    return setResponse(res,"NOT VALid",404)
  }
})

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const errorData = error as {
    message?: string;
    error?: { message?: string };
  };
  const message =
    errorData?.error?.message || errorData?.message || "Request failed";

  console.error("Request error:", error);
  return res.status(500).json({
    status: "fail",
    message,
  });
});
CheckandSendTask();

export default app;
