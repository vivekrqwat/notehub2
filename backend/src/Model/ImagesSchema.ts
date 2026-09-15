import mongoose from "mongoose";
import { Images } from "../Interfaces/Interface";
const Schema=mongoose.Schema;
const ImagesSchema= new mongoose.Schema({
  imagename:{type:String,required:true},
  imageurl:{type:String,required:true},
  public_id:{type:String,required:true},
  notesid:{type:Schema.Types.ObjectId,ref:"Notes"},
}, { timestamps: true })
export const ImagesModel= mongoose.model<Images>("images",ImagesSchema)