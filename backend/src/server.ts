import express from "express";
import Config from "./Config/AllPath";
import dotenv from "dotenv";
import UserRouter from "./Route/User";
const app=express();
dotenv.config();
app.use(express.json());

//
const {Login_SignUP}=Config
app.use(Login_SignUP,UserRouter)

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route not found",
  });
})

export default app;