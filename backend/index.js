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
const compression = require("compression");
dotenv.config();
const cors = require("cors");
const { loginRateLimiter, noCacheMiddleware, cacheMiddleware } = require("./utils/middleware.js");


app.use(express.json({limit: '10mb'}));

// CORS configuration - supports both local and production environments
const corsOrigins = [
  "http://localhost:5173",
  "http://localhost:5173/",
  "http://localhost:5175",
  "https://revesion2.onrender.com"
  // Add your Render frontend URL here after deployment
  // "https://your-frontend.onrender.com"
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
  threshold: 1024  // Only compress responses > 1KB
}));



//cache
// app.use((req, res, next) => {
//   res.setHeader("Cache-Control", "public, max-age=3600");
//   next();
// });



app.use(cookieParser())


app.use('/apii/user',noCacheMiddleware,userrouter);
app.use('/apii/post',cacheMiddleware,postrouter);
app.use('/apii/dir',dirrouter);
app.use('/apii/notes',notes);
app.use('/apii/upcheck',noCacheMiddleware,upload)
app.use('/apii/pdfdownlaod/',dirrouter);
app.get("/apii/health", (req, res) => {
  res.status(200).send("OK");
});

dbconnect()
app.listen(8000,()=>{
    console.log("server connected")
})