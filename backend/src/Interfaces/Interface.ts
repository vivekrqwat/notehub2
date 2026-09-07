import {Document} from "mongoose";

export interface User extends Document {
    name:string,
    email:string,
    password:string,
    profilepic:string,
    bgpic:string,
   
    createdAt:Date,
    updatedAt:Date
}