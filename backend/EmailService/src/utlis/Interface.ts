import { Document } from "mongoose";

export const QueueTypeOTP:string='otpemail'
interface OTPPROP {
    durable: boolean;
    arguments: {
        'x-queue-type': string;
    };
}
 export const OtpProp:OTPPROP={
         durable: true,
  arguments: {
    'x-queue-type': 'quorum'
  }}

  export interface OtpMessage{
    email:string;
    description:string;
  } 

export interface Task extends Document {
    Date: Date;
    to: string;
    taskdescription: string;

}