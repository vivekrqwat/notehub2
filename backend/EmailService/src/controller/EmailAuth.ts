import { transporter } from "../utlis/EmailTranspoter"
import { QueueTypeOTP,OtpProp } from "../utlis/Interface"
import RmqConnection from "../utlis/RMQconnection"

const EmailAuth=async(req,res,next)=>{

const {connection,channel}= await RmqConnection()
const {email,description}=req.body
const Data={
    email:email,
    description:description
}

await channel.assertQueue(QueueTypeOTP,OtpProp)
await channel.sendToQueue(QueueTypeOTP,Buffer.from(JSON.stringify(Data)))
  setTimeout(function() {
  connection.close();
  process.exit(0)
}, 500);


}