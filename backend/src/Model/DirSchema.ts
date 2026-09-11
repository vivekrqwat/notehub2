import mongoose from "mongoose";
import { DIR } from "../Interfaces/Interface";
const Schema=mongoose.Schema;
const DIR_SCHEMA=new mongoose.Schema({
    name:{type:String,required:true},
    uid:{type:Schema.Types.ObjectId,ref:"User",required:true}, 

})

export const DirModel= mongoose.model<DIR>("DirSchema",DIR_SCHEMA)