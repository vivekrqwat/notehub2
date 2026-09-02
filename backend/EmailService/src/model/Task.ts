import mongoose from "mongoose";
import { Task } from "../utlis/Interface";
const TASK_SCHEMA=new mongoose.Schema({
    Date:{type:Date,required:true},
    to:{type:String,required:true},
    taskdescription:{type:String,required:true},

     },{timestamps:true})

     export const TaskModel=mongoose.model<Task>("Task",TASK_SCHEMA)
