const Postmodel = require('../models/Post');
const Usermodel = require('../models/User');
const {error,response} = require('../utils/Error');
const bcrypt=require("bcryptjs");
const { authenticate } = require('../utils/middleware');
const router=require('express').Router();
const moment=require("moment")


//create

router.post('/',authenticate,async (req,res)=>{
    const{email,username}=req.body
    
    if(!req.user) return error(res,400,{message:"user not found"});
    req.body.uid=req.user._id.toString();
   
   
    try{
        const post=await new Postmodel(req.body)
        savepost=await post.save();
        const formatted = moment().format('YYYY-MM-DD');
        console.log(req.body.uid,"user id")
       
      const updatedUser = await Usermodel.findByIdAndUpdate(
      req.body.uid,
      { $addToSet: { submission: formatted } },
      { new: true }
    );
    // console.log(updatedUser,"updated")

    
        

        // console.log("posted",formatted)
        return response(res,200,savepost)
    }catch(e){
         return error(res,500,{error:e,message:"post_error"})
    }

})
//get
router.get('/:id',async (req,res)=>{
    const id=req.params.id
    //   if (req.user._id.toString() !== id) {
    //     return error(res, 400, { message: "Not a valid user" });
    // }
    
    console.log("post",id)
    try{
       const post=await Postmodel.find({uid:id});
         return response(res,200,post);

    }
    catch(e){
    return error(res,500,{error:e,message:"getting_id__error"})

    }

})
// getall
router.get('/',async (req,res)=>{
   
    try{
        // console.log("ppost")
        const allpost=await Postmodel.find();
        return response(res,200,allpost);
    }
    catch(e){
    return error(res,500,{error:e,message:"getting post__error"})

    }

})
// update user
router.put('/update/:id',authenticate,async(req,res)=>{
      if (req.user._id.toString() !== id) {
        return error(res, 400, { message: "Not a valid user" });
    }
 
  
  
    try{
       const updatepost=await Postmodel.findOneAndUpdate({uid:id},{$set:req.body},{new:true})
        if (!updatepost) return error(res,400,"no updates")
       return response(res,200,updatepost)


    }catch(e){
        console.log(e);
    return error(res,500,{error:e,message:"updating error"})

    }
})
//delete all post
router.delete('/update/:id',async(req,res)=>{
       if (req.user._id.toString() !== id) {
        return error(res, 400, { message: "Not a valid user" });
    }
   
  
    try{
       const deletepost=await Postmodel.deleteMany({uid:id})
        if (!deletepost) return error(res,400,"no updates")
       return response(res,200,deletepost)


    }catch(e){
    return error(res,500,{error:e,message:"delete error"})

    }
})
//delet specific post
router.delete('/postid/:id',async(req,res)=>{
   const id=req.params.id;
    try{
       const deletepost=await Postmodel.findByIdAndDelete(id)
        if (!deletepost) return error(res,400,"no updates")
       return response(res,200,deletepost)


    }catch(e){
    return error(res,500,{error:e,message:"delete error"})

    }
})



module.exports=router