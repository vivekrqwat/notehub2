import mongoose from "mongoose";
const Schema=mongoose.Schema;

const TASK_SCHEDULER_SCHEMA=new mongoose.Schema({
    title:{type:String,required:true},
    desc:{type:String,required:true},
    email:{type:String,required:true},
    Date:{type:Date,required:true},
    
    uid:{type:Schema.Types.ObjectId,ref:"User",required:true},})

