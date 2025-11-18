const router=require('express').Router();
const Directorymodel = require('../models/Directory');
const {error,response} = require('../utils/Error');
const { authenticate, dataRateLimiter } = require('../utils/middleware');


// create
router.post("/",authenticate,async(req,res)=>{
  
    try{
          console.log("post dir",req.body)
    const dir=await new Directorymodel(req.body)

    const savedir=await dir.save();
    console.log("dir created")
    return response(res,200,savedir)

    }
    catch(e){
        return error(res,500,{error:e,message:"on creation dir"})
    }
})

//getall
router.get('/all',async(req,res)=>{
    try{
       
        const alldir=await Directorymodel.find();
         console.log("req");
        return response(res,200,alldir)
    }catch(e){
         return error(res,500,{error:e,message:"on getting dir"})
    }
})
//get by id 
router.get('/:id',dataRateLimiter,async(req,res)=>{
    try{
       const uid=req.params.id
       console.log("dir id",uid)
        const alldir=await Directorymodel.find({uid:uid});
         console.log("req");
        return response(res,200,alldir)
    }catch(e){
         return error(res,500,{error:e,message:"on getting dir"})
    }
})

// update dir
router.put("/:id",authenticate,async(req,res)=>{
    const {id}=req.params
    try{
        const updatedir= await Directorymodel.findByIdAndUpdate(id,
            {set:req.body},{new:true}
        )
             return response(res,200,updatedir)

    }
    catch(e){
        return error(res,404,{error:e,message:"on updating dir"})
    }
})
//delete
router.delete("/:id",async(req,res)=>{
    const {id}=req.params
    console.log("Delete request for directory ID:", id);
    try{
        const deletedir= await Directorymodel.findByIdAndDelete(id)
        console.log("Delete result:", deletedir);
        if (!deletedir) return error(res,404,{message:"Directory not found"})
        console.log("Directory deleted successfully");
        return response(res,200,{message:"Directory deleted successfully", data: deletedir})

    }
    catch(e){
        console.error("Delete error:", e);
        return error(res,404,{error:e.message,message:"on Deletion dir"})
    }
})













module.exports=router