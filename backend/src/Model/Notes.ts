import mongoose from "mongoose"
const Schema=mongoose.Schema;
const NOTES_SCHEMA=new mongoose.Schema({
    title:{type:String,required:true},
    desc:{type:String,required:true}, 
dirid:{type:Schema.Types.ObjectId,ref:"DIR"}  })