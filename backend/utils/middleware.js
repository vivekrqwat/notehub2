const jwt=require('jsonwebtoken');
const { error } = require('./Error');
const Usermodel = require('../models/User');
const rateLimit = require("express-rate-limit");

 async function assignwebtoken(data,res){
    // console.log(process.env.JT)
    const token=jwt.sign(data,process.env.JT,{
         expiresIn: "7d",
    })
   res.cookie("jwt", token, {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,

  path: "/"
});
    return token;


}


const authenticate=async (req,res,next)=>{
    try{
    const token=req.cookies.jwt
    // console.log(token)
    if(!token)return error(res,400,{message:"no token was given"})

    const decode=jwt.verify(token,process.env.JT);
    if(!decode)return error(res,400,{message:"no token was given"})
    const{email,id}=decode;
// console.log("decode",id)
  const user = await Usermodel.findById(id).select("-password");
  req.user=user;
  console.log("user",user.id)
  next();

    }catch(e){
        console.log(e);
        return error(res,400,{error:e,message:"error in authenticate"})}
}

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 3 login requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.log(`🚫 Rate limit hit by IP: ${req.ip} at ${new Date().toLocaleTimeString()}`);
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again after 15 minutes.",
    });
  },
});

const dataRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    console.log(`🚫 Rate limit hit by IP: ${req.ip} at ${new Date().toLocaleTimeString()}`);
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please wait a moment before trying again.",
    });
  },
});
//chace
const noCacheMiddleware = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
};

const cacheMiddleware = (req, res, next) => {
  if (req.method === 'GET') {
    res.setHeader("Cache-Control", "public, max-age=3600"); // 1 hour cache
  } else {
    res.setHeader("Cache-Control", "no-store, no-cache");
  }
  next();
};

module.exports={assignwebtoken,authenticate,loginRateLimiter,dataRateLimiter,noCacheMiddleware,cacheMiddleware}