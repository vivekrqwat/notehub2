import mongoose from "mongoose";
import { TASKSCHEDULE } from "../Interfaces/Interface";
const Schema=mongoose.Schema;

const TASK_SCHEDULER_SCHEMA=new mongoose.Schema({
    title:{type:String},
    desc:{type:String,required:true},
    email:{type:String,required:true},
    Date:{type:String,required:true},
    time:{type:String},
    
    uid:{type:Schema.Types.ObjectId,ref:"User",required:true},})

export const TaskModel= mongoose.model<TASKSCHEDULE>("TAsk",TASK_SCHEDULER_SCHEMA)