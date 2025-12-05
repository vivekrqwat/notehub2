const Postmodel = require('../models/Post');
const Usermodel = require('../models/User');
const {error,response} = require('../utils/Error');
const bcrypt=require("bcryptjs");
const {assignwebtoken,authenticate, loginRateLimiter} = require('../utils/middleware');
const moment = require("moment");
const router=require('express').Router();

//auth
router.get("/check",authenticate, async (req, res) => {
    try{
        const user=req.user;
        if(!user)return error(res, 404, { message: "User not found" });
        // console.log("backend user",user)
        return response(res,200,user);
    }catch(e){
        return error(res,400,{message:"not valid"})
    }

})
//register

router.post('/signup',  loginRateLimiter,async (req,res)=>{
   
    try{        const salt=await bcrypt.genSalt(10);
                req.body.password=await bcrypt.hash(req.body.password,salt);

            const newuser=await new Usermodel(req.body);
            if(!newuser)error(res,401,"invalid credential");
            const usertokendata={
                email:newuser.email,
                username:newuser.username,
                id:newuser._id.toString()

            }

            const saveuser=await newuser.save();
           await  assignwebtoken(usertokendata,res);
       return  response(res,200,usertokendata)
    }catch(e){
       return error(res,500,{error:e,message:"signup_error"})
    }

})
//login

// Apply rate limiter to login attempts (protects against brute-force)
router.post('/login', loginRateLimiter, async (req,res)=>{
    const{username,email,password}=req.body
    
   
    try{
        const user=await Usermodel.findOne({email:email});
        if(!user)return error(res,401,"invalid credential");
       
        const validpassowrd=await bcrypt.compare(password, user.password)
        if(!validpassowrd)error(res,401,"invalid password");
         const usertokendata={
                eamil:user.email,
                user:user.username,
                id:user._id.toString()

            }
       await  assignwebtoken(usertokendata,res);
        return response(res,200,usertokendata)
    }catch(e){
         return error(res,500,{error:e,message:"login_error"})
    }

})
//get
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  // console.log(id,"user id");
  // console.log("Requested user ID:", id);

  try {
    const user = await Usermodel.findById(id);

    if (!user) {
      return error(res, 404, { message: "User not found" });
    }

    return response(res, 200, user);
  } catch (e) {
    return error(res, 500, { error: e, message: "getting_id_error" });
  }
});

//getall
router.get('/',async (req,res)=>{
   
    try{
        const user=await Usermodel.find();
          if(!user)error(res,401,"user not found");
         const safeUsers = user.map(({ _doc }) => {
            const { password, ...rest } = _doc;
            return rest;
        });
          return response(res,200,safeUsers)
    }
    catch(e){
    return error(res,500,{error:e,message:"getting_id__error"})

    }

})
//update user
router.put('/update/:id',async(req,res)=>{
     const {id}=req.params
    if (req.user._id.toString() !== id) {
        return error(res, 400, { message: "Not a valid user" });
    }
     const {password}=req.body
    try{
        if(password){
        const salt=await bcrypt.genSalt(10);
        req.body.password=await bcrypt.hash(password,salt)
        }
 const updatedUser = await Usermodel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true } 
        ); 
         if (!updatedUser) return error(res,400,"no updates")
        return response(res,200,updatedUser)


    }catch(e){
    return error(res,500,{error:e,message:"updating error"})

    }
})
//submmisiion
router.post("/submission/:id", authenticate, async (req, res) => {
  try {
    const uid = req.params.id;
    const formatted = moment().format("YYYY-MM-DD");
// console.log("hello")
//     console.log("✅ Submission attempt for:", formatted);

    const updatedUser = await Usermodel.findByIdAndUpdate(
      uid,
      { $addToSet: { submission: formatted } }, // Ensures uniqueness
      { new: true }
    );

    if (!updatedUser) {
      return error(res, 404, { message: "User not found" });
    }

    return response(res, 200, updatedUser);
  } catch (e) {
    // console.error("❌ Error updating submission:", e);
    return error(res, 500, { error: e, message: "Updating error" });
  }
});
//logout
router.post("/logout",async(req,res)=>{
    try{
      // console.log("logout route hit");
   res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    // console.log("logout route hit2");
        return response(res, 200, { message: "Logged out successfully" });

    }catch(e){
        return error(res, 500, { error: e, message: "loging out error" });
    }
})



module.exports=router