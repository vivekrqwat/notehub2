import { QueueTypeOTP,OtpProp } from "../utlis/Interface";
import RmqConnection from "../utlis/RMQconnection";
import ConsumerFunctions from "./ConsumerFunctions";
const Consumer= async()=>{
    try{
    const {connection,channel}= await RmqConnection()
    await channel.assertQueue(QueueTypeOTP,OtpProp)
// Consumer.ts


await channel.consume(
  QueueTypeOTP,
  (msg:any) => ConsumerFunctions.SendEmailFunc(channel, msg),
  { noAck: false }
);    }catch(err){
        console.error("Error in consumer:", err);
    }


}
Consumer();