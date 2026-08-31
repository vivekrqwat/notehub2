const {AppStart,app} = require("./Allroute")
const dbconnect=require('./utils/dbconnect.js')


dbconnect()
app.listen(8000,()=>{
  AppStart();
    console.log("server connected")
})