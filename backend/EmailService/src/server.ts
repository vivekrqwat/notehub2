import express from "express";
const app=express();
import dotenv from "dotenv";

import EmailRouter from "./route/EmailRoute";
import Config from "./utlis/Config";
const {AUTH,TASKSCHEDULE}=Config
console.log(AUTH);

dotenv.config();

app.use(express.json());
app.use(AUTH,EmailRouter)
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
});



export default app;