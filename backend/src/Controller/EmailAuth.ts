import { Request, Response } from 'express';

import { QueueTypeOTP,OtpProp, EmailAuthReq } from "../utils/Interface"
import RmqConnection from "../utils/RMQconnection"



const EmailAuth=async(req:Request<any,any,EmailAuthReq>,res:Response)=>{

const {connection,channel}= await RmqConnection()
const {email,description}=req.body
console.log(email,description)
const Data={
    email:email,
    description:description
}

await channel.assertQueue(QueueTypeOTP,OtpProp)
await channel.sendToQueue(QueueTypeOTP,Buffer.from(JSON.stringify(Data)))
  setTimeout(function() {
  connection.close();

}, 500);
 return  res.status(200).json({ success: true, message: "OTP queue initialized" });

}

export default EmailAuth