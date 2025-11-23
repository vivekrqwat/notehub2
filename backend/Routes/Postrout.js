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
        const post = new Postmodel(req.body);
        const savepost = await post.save();
        const formatted = moment().format('YYYY-MM-DD');
        console.log(req.body.uid,"user id")
       
      const updatedUser = await Usermodel.findByIdAndUpdate(
      req.body.uid,
      { $addToSet: { submission: formatted } },
      { new: true }

    );
    console.log(updatedUser,"updated")

    
        

        // console.log("posted",formatted)
        return response(res,200,savepost)
    }catch(e){
        console.log("error",e);
         return error(res,500,{error:e,message:"post_error hai"})
    }

})

// ✅ LIKE ROUTE - MUST BE BEFORE /:id
router.put('/like/:id', authenticate, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user._id.toString();

  try {
    const post = await Postmodel.findById(postId);
    if (!post) return error(res, 400, "Post not found");

    // Check if user already liked the post
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // Remove like (unlike)
      post.likes = post.likes.filter(id => id !== userId);
    } else {
      // Add like
      post.likes.push(userId);
    }

    const updatedPost = await post.save();
    return response(res, 200, updatedPost);
  } catch (e) {
    console.log(e);
    return error(res, 500, { error: e, message: "Error updating likes" });
  }
});

// ✅ COMMENT ROUTES - MUST BE BEFORE /:id
router.post('/comment/:id', authenticate, async (req, res) => {
  const postId = req.params.id;
  const { text } = req.body;
  const userId = req.user._id.toString();
  const userName = req.user.username;
  const userEmail = req.user.email;

  if (!text || !text.trim()) {
    return error(res, 400, { message: "Comment cannot be empty" });
  }
  console.log("comment")

  try {
    const post = await Postmodel.findById(postId);
    if (!post) return error(res, 400, "Post not found");

    const comment = {
      _id: new Date().getTime().toString(),
      userId,
      userName,
      userEmail,
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    const updatedPost = await post.save();
    return response(res, 200, updatedPost);
  } catch (e) {
    console.log(e);
    return error(res, 500, { error: e, message: "Error adding comment" });
  }
});

// ✅ DELETE COMMENT - MUST BE BEFORE /:id
router.delete('/comment/:postId/:commentId', authenticate, async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id.toString();

  try {
    const post = await Postmodel.findById(postId);
    if (!post) return error(res, 400, "Post not found");

    // Find the comment
    const comment = post.comments.find(c => c._id === commentId);
    if (!comment) return error(res, 400, "Comment not found");

    // Check if user is the comment author
    if (comment.userId !== userId) {
      return error(res, 403, { message: "Not authorized to delete this comment" });
    }

    // Remove comment
    post.comments = post.comments.filter(c => c._id !== commentId);
    const updatedPost = await post.save();
    return response(res, 200, updatedPost);
  } catch (e) {
    console.log(e);
    return error(res, 500, { error: e, message: "Error deleting comment" });
  }
});

// ✅ DELETE SPECIFIC POST - MUST BE BEFORE /:id
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

// ✅ UPDATE - MUST BE BEFORE /:id
router.put('/update/:id',authenticate,async(req,res)=>{
      if (req.user._id.toString() !== req.params.id) {
        return error(res, 400, { message: "Not a valid user" });
    }
 
  
  
    try{
       const updatepost=await Postmodel.findOneAndUpdate({uid:req.params.id},{$set:req.body},{new:true})
        if (!updatepost) return error(res,400,"no updates")
       return response(res,200,updatepost)


    }catch(e){
        console.log(e);
    return error(res,500,{error:e,message:"updating error"})

    }
})

// ✅ DELETE ALL USER POSTS - MUST BE BEFORE /:id
router.delete('/update/:id',authenticate,async(req,res)=>{
       if (req.user._id.toString() !== req.params.id) {
        return error(res, 400, { message: "Not a valid user" });
    }
   
  
    try{
       const deletepost=await Postmodel.deleteMany({uid:req.params.id})
        if (!deletepost) return error(res,400,"no updates")
       return response(res,200,deletepost)


    }catch(e){
    return error(res,500,{error:e,message:"delete error"})

    }
})

// getall - sorted by latest first
router.get('/',async (req,res)=>{
   
    try{
        // console.log("ppost")
        const allpost=await Postmodel.find().sort({createdAt: -1});
        return response(res,200,allpost);
    }
    catch(e){
    return error(res,500,{error:e,message:"getting post__error"})

    }

})

//get posts by user id - MUST BE LAST - sorted by latest first
router.get('/:id',async (req,res)=>{
    const id=req.params.id
    
    console.log("post",id)
    try{
       const post=await Postmodel.find({uid:id}).sort({createdAt: -1});
         return response(res,200,post);

    }
    catch(e){
    return error(res,500,{error:e,message:"getting_id__error"})

    }

})



module.exports=router