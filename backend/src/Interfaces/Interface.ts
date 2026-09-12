import {Document, Types} from "mongoose";

export interface User extends Document {
    name:string,
    email:string,
    password:string,
    profilepic:string,
    bgpic:string,
   
    createdAt:Date,
    updatedAt:Date
}
export interface UserData{
    _id: Types.ObjectId; 
     name:string,
    email:string,
    password:string,
    profilepic:string,
    bgpic:string,
   
  createdAt: string; // ISO Date string from JSON
  updatedAt: string;
}

export interface OTP extends Document{
   _id: Types.ObjectId ,
   email:string
   otp:string,
   createdAt:Date


}
export interface DIR extends Document{
   _id: Types.ObjectId ,
   uid:Types.ObjectId
   name:string,
  



}

   export interface NOTES extends Document{
       _id: Types.ObjectId ,
       title:string,
       desc:string,
       dirid:Types.ObjectId
   }