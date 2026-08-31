const express=require("express")
 const app=express();

const dotenv=require("dotenv");
const userrouter=require("./Routes/Userroutes.js")
const postrouter=require("./Routes/Postrout.js")
const dirrouter=require("./Routes/DirRoute.js")
const notes=require("./Routes/notesroute.js")
const upload=require("./Routes/Upload.js")
const ai=require("./Routes/Genai.js")
const rateLimit = require('express-rate-limit');
const cookieParser = require("cookie-parser");
const compression = require("compression");
dotenv.config();
const cors = require("cors");
const { loginRateLimiter, noCacheMiddleware, cacheMiddleware } = require("./utils/middleware.js");
const ApiConfig = require("./ApiConfig.js");

const{userRoute,postRoute,DirRoute,NotesRoute}=ApiConfig


 const AppStart=()=>{

app.use(express.json({limit: '10mb'}));


const corsOrigins = [
  "http://localhost:5173",
  "http://localhost:5173/",
];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization','']
}));

//comperssion
app.use(compression({
  level: 6,
  threshold: 1024  
}));


app.use(cookieParser())

console.log("ew")
app.use(userRoute,noCacheMiddleware,userrouter);
app.use(postRoute,postrouter);
app.use(DirRoute,dirrouter);
app.use(NotesRoute,notes);
app.use('/apii/upcheck',noCacheMiddleware,upload)
app.use('/apii/pdfdownlaod/',dirrouter);
app.use('/apii/genai',ai)
app.get("/apii/health", (req, res) => {
  res.status(200).send("OK");
});



}

module.exports={AppStart,app}