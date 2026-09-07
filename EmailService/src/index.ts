import app from "./server";
import { DbConnect } from "./utlis/DbConnect";
 // Standard static import

const Allconnect=async ()=>{
try{
    await DbConnect(); 
    console.log("Database connected. Starting server...");
    app.listen(3001, () => {
        console.log("Email Service is running on port 3001");
    })
}catch(err){  
    console.log("Error connecting to MongoDB:", err);
    process.exit(1);
  }
}


Allconnect();