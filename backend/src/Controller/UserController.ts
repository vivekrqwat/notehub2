import { NextFunction, request, Request, response, Response } from "express";
import EmailAuth from "./EmailAuth";
import UserModel from "../Model/UserSchema";
import bcrypt from "bcryptjs";
import Messages from "../Config/Messages";
import setResponse from "../utils/ResponseHandler";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
import dotenv from "dotenv";
import CheckEmail from "./EmailAuth";
import { Otpmodel } from "../Model/Otp";
import { getPaginationOptions } from "../utils/PaginationQuery";

export const UserReg = async (req: Request, res: Response) => {
 console.log(req.body)
  const { email, password } = req.body;
  console.log(email,password)
  if (!email || !password) return setResponse(res, Messages.WrongCred, 404);
   console.log(req.body)
  const existingUser = await UserModel.findOne({ email }).lean();
  if (existingUser) {
    console.log("user hai")
    return res.status(409).json({ message: Messages.User });
  }
    if (!process.env.KEY) return setResponse(res, Messages.ENV, 505);


  const salt = bcrypt.genSaltSync(10);
  const hashedpassword = bcrypt.hashSync(password, salt);
  const body = {
    email: email,
    password: hashedpassword,
  };
  
  const data = new UserModel(body);
  const otpbody = { _id:data._id,email: email };
  console.log(data)


  const savedData = await data.save();
  console.log("datais saved")
  const token = jwt.sign({ otpbody }, process.env.KEY, { expiresIn: "1h" });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 5 * 60 * 60 * 1000,
  });

  return setResponse(res, "saved", 200);
};
dotenv.config();

export const UserLogin = async (req: Request, res: Response) => {
  console.log("userlogin");
  if (!process.env.KEY) return setResponse(res, Messages.ENV, 505);
  const { email, password } = req.body;
  if (!email || !password) return res.json({ message: Messages.WrongCred });
  const userdata = await UserModel.findOne({ email: email });
  if (!userdata) return res.json({ message: Messages.WrongCred });
  const Match = await bcrypt.compare(password, userdata.password);
  if (!Match) return setResponse(res, Messages.WrongCred, 404);
  const data = await UserModel.findOne({ email: email }).select("-password");
  const obj = { id: data?._id, email: data?.email };

  const token = jwt.sign( obj , process.env.KEY, { expiresIn: "1h" });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 5 * 60 * 60 * 1000,
  });
console.log("jwt",token)
  return setResponse(res,"ok",200);
};
export const SendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return setResponse(res, Messages.WrongCred, 404);
  const useremail = await UserModel.findOne({ email: email })
    .select("email")
    .lean();
  console.log(useremail);
  if (!useremail) return setResponse(res, Messages.WrongCred, 404);

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("callesd", otp);
  await Otpmodel.deleteMany({ email: email.toLowerCase() });
  await Otpmodel.create({
    email: email.toLowerCase(),
    otp: otp,
  });
  const msg = await CheckEmail(email, `you Otp from note hub is${otp}`);
  return res.status(200).json(msg);
};

export const VerifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email) return setResponse(res, Messages.WrongCred, 404);
  const Uotp = await Otpmodel.findOne({ email: email, otp: otp })
    .sort({ createdAt: -1 })
    .select({ email: 1, _id: 1 })
    .lean();
  if (!Uotp) return setResponse(res, "Invalid or expired OTP.", 400);
  const cookieOptions: any = {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 5 * 60 * 1000,
  };
      if (!process.env.KEY) return setResponse(res, Messages.ENV, 505);
   
  const user={id:Uotp._id,email:Uotp.email}
   const token = jwt.sign( user , process.env.KEY, { expiresIn: "1h" });
   console.log("otp",token,user)
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 5 * 60 * 60 * 1000,
  });
 

  await Otpmodel.deleteOne({ _id: Uotp._id });
  return setResponse(res, "OTP verified successfully.", 200);
};

export const getAllUser = async (req: Request, res: Response) => {
  const { skip, limit, page } = getPaginationOptions(req.query);
  const UsersData = await UserModel.find().skip(skip).limit(limit);
  if (!UsersData) return setResponse(res, [], 404);
  return setResponse(res, UsersData, 404);
};
