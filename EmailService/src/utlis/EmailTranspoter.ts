import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const transporter=nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    auth:{
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
    },secure:true,
    port:465
})