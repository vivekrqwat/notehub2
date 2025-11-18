const router=require('express').Router();
const Directorymodel = require('../models/Directory');
const Notesmodel = require('../models/notes');
const {error,response} = require('../utils/Error');
const mongoose = require("mongoose");
const { authenticate, dataRateLimiter } = require('../utils/middleware');


// create
router.post("/",dataRateLimiter,async(req,res)=>{

    const dirid=req.body.dirid;
    console.log(req.body,"notes")
    if(!dirid)return error(res,404,{message:"getting dirid"})

    try{
    const notes=await new Notesmodel(req.body)


    // const updatedir=await Directorymodel.findByIdAndUpdate(dirid,{
    //     $push:{
    //         topic:{
    //             noteId:notes._id
    //         }
    //     }
    // })
        
    // if(!updatedir) return error(res,404,{message:"error on updating dir notes"})
   const savenotes=await notes.save();
    return response(res,200,savenotes)

    }
    catch(e){
        return error(res,500,{error:e,message:"on creation notes"})
    }
})

//getall
router.get('/all',async(req,res)=>{
    try{
        const allnotes=await Notesmodel.find();

        return response(res,200,allnotes)
    }catch(e){
         return error(res,500,{error:e,message:"on getting notes"})
    }
})
//getnotes by id
router.get('/:id',dataRateLimiter,async(req,res)=>{
    // id is dirid
    const id=req.params.id
    
    try{ console.log(id,"get")
        const allnotes=await Notesmodel.find({dirid:id});
       
       
        

        return response(res,200,allnotes)
    }catch(e){
         return error(res,500,{error:e,message:"on getting notes"})
    }
})
//get all notes of selected dir  note
router.get('/all/:id',async(req,res)=>{
    // id is dirid
    const id=req.params.id
    
    try{ console.log(id,"get")
        const allnotes=await Notesmodel.findById(id);
       
       
        

        return response(res,200,allnotes)
    }catch(e){
        console.log(e)
         return error(res,500,{error:e,message:"on getting notes"})
    }
})


// update dir
router.put("/:id",authenticate,async(req,res)=>{
    const id=req.params.id
console.log(req.body,"update")
    try{
        const updatedir= await Notesmodel.findByIdAndUpdate(id,
            {$set:req.body},{new:true}
        )
             return response(res,200,updatedir)

    }
    catch(e){
        return error(res,404,{error:e,message:"on updating dir"})
    }
})
//delete
router.delete("/:id",authenticate,async(req,res)=>{
    const id=req.params.id
    try{
        const note = await Notesmodel.findById(id);
    if (!note) return error(res, 404, { message: "Note not found" });
    const dirid=note.dirid;
   console.log(dirid.toString())
//    const dir=await Directorymodel.findById(dirid.toString());
//    console.log(dir);
//    response(res,200,"send");

//    const updateDir = await Directorymodel.findByIdAndUpdate(
//       dirid.toString(),
//         {$set:req.body},{new:true}
//     );
//      console.log(dirid)


        const deletenotes= await Notesmodel.findByIdAndDelete(id)
             return response(res,200,deletenotes)

    }
    catch(e){
        console.log(e);
        return error(res,404,{error:e,message:"on Deletion dir"})
    }
})
//deletion of notes by dir id 
router.delete("/dirdelete/:dirid",async(req,res)=>{
    const {dirid}=req.params;
    try{
        console.log("deleted notes",dirid)
        const deleted=await Notesmodel.deleteMany({dirid})
         res.status(200).json({
      message: `${deleted.deletedCount} note(s) deleted with dirid ${dirid}`,
    });
    }
    catch(e){
           console.log(e);
        return error(res,404,{error:e,message:"on Deletion dir"})
    }
})
//deletion content of  notes
router.delete("/Notes/:noteId/content/:contentId",async(req,res)=>{
   const { noteId, contentId } = req.params;
console.log('notes content')
  try {
    const result = await Notesmodel.findByIdAndUpdate(
      noteId,
      { $pull: { content: { _id: contentId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Note not found" });
    }

    return res.status(200).json({ message: "Content removed", updatedNote: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
})













module.exports=router