import mongoose from "mongoose"
import { NOTES } from "../Interfaces/Interface";
const Schema=mongoose.Schema;
const NOTES_SCHEMA=new mongoose.Schema({
    title:{type:String},
    desc:{type:String}, 
dirid:{type:Schema.Types.ObjectId,ref:"DIR"}  })
export const NotesModel= mongoose.model<NOTES>("Notes",NOTES_SCHEMA)