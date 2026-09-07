// ConsumerFunctions.ts
import { Channel, ConsumeMessage } from 'amqplib';
import { transporter } from "../utlis/EmailTranspoter";
import { OtpMessage } from "../utlis/Interface";

export const SendEmailFunc = async (channel: Channel, msg: ConsumeMessage | null): Promise<void> => {
  if (!msg) {
    console.error("Received null message in SendEmailFunc.");
    return;
  }

  try {
    const { email, description }: OtpMessage = JSON.parse(msg.content.toString());

    if (!email || !description) {
      console.error("Email or description is missing in the message.");
      channel.nack(msg, false, false); // discard malformed message, don't requeue
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL || "vivekrawaturfsam@gmail.com",
      to: email,
      subject: "OTP From NOTEHIB",
      text: description,
    });

    channel.ack(msg); // only ack after successful send
  } catch (err) {
    console.error("Error in SendEmailFunc:", err);
    channel.nack(msg, false, false); // or requeue: channel.nack(msg, false, true)
  }
};


export default { SendEmailFunc };