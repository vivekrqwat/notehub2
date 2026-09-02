import mongoose from "mongoose";
const Schema=mongoose.Schema;
const DIR_SCHEMA=new mongoose.Schema({
    name:{type:String,required:true},
    uid:{type:Schema.Types.ObjectId,ref:"User",required:true}, 

})