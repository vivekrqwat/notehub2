import mongoose, { Mongoose } from "mongoose"

export const CheckForTypeId=(id:string):boolean=>{
    return mongoose.Types.ObjectId.isValid(id);
}