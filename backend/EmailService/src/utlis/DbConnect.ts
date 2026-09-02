import mongoose from "mongoose";


const MONGO_URL=process.env.MONGO_URL;
export const DbConnect=async():Promise<void>=>{
     if (!MONGO_URL) {
        console.error("Critical Error: MONGO_URL environment variable is not defined.");
        process.exit(1);
    }
    try{
        if(mongoose.connection.readyState===1){
            return;
        }
        await mongoose.connect(MONGO_URL);
    }catch(err){
        console.log("Error connecting to MongoDB:", err);
        process.exit(1);

    }

}