const express=require("express")
const app=express();
const dbconnect=require('./utils/dbconnect.js')
const dotenv=require("dotenv");
const userrouter=require("./Routes/Userroutes.js")
const postrouter=require("./Routes/Postrout.js")
const dirrouter=require("./Routes/DirRoute.js")
const notes=require("./Routes/notesroute.js")
const upload=require("./Routes/Upload.js")
const rateLimit = require('express-rate-limit');
const cookieParser = require("cookie-parser");
dotenv.config();
const cors = require("cors");
const { loginRateLimiter } = require("./utils/middleware.js");

// CORS configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5175"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser())
app.use(express.json());

app.use('/apii/user',userrouter);
app.use('/apii/post',postrouter);
app.use('/apii/dir',dirrouter);
app.use('/apii/notes',notes);
app.use('/apii/upcheck',upload)

dbconnect()
app.listen(8000,()=>{
    console.log("server connected")
})