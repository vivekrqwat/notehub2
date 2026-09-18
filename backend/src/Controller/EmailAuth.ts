import { Request, Response } from "express";

import { QueueTypeOTP, OtpProp, EmailAuthReq } from "../utils/Interface";
import RmqConnection from "../utils/RMQconnection";

const CheckEmail = async (email: string, message: string) => {
  const { connection, channel } = await RmqConnection();

  const Data = {
    email: email,
    description: message,
  };

  await channel.assertQueue(QueueTypeOTP, OtpProp);
  await channel.sendToQueue(QueueTypeOTP, Buffer.from(JSON.stringify(Data)));
  setTimeout(function () {
    connection.close();
  }, 500);
  return "otp is send successfuly";
};

export default CheckEmail;
