import { DbConnect } from "./DB/Dbconnect";
import app from "./server";
const ALLconnection=async ()=>{
  try{

    await DbConnect()
    app.listen(3004, () => {
  console.log("Server is running on port 3004");
})

  }catch(e){
    console.log(e)
  }
}

ALLconnection()