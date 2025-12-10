const router=require('express').Router();
const Directorymodel = require('../models/Directory');
const Notesmodel = require('../models/notes');
const {error,response} = require('../utils/Error');
const { authenticate, dataRateLimiter } = require('../utils/middleware');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { convert } = require('html-to-text');

// create
router.post("/",authenticate,async(req,res)=>{
  
    try{
        //   console.log("post dir",req.body)
    const dir=await new Directorymodel(req.body)
 
    const savedir=await dir.save();
    console.log("save created",savedir)
   
    return response(res,200,savedir)

    }
    catch(e){
        return error(res,500,{error:e,message:"on creation dir"})
    }
})

//getall
router.get('/allone',async(req,res)=>{
    try{
         console.log("get all dir req");
        const alldir=await Directorymodel.find({isPublic:true});
     
        return response(res,200,alldir)
    }catch(e){
         return error(res,500,{error:e,message:"on getting dir"})
    }
})
//get by id 
router.get('/:id',async(req,res)=>{
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
    console.log("Update request for directory ID:", id, "with data:", req.body);
    try{
        const updatedir= await Directorymodel.findByIdAndUpdate(id,
             req.body,{new:true}
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
//upvotes
// Add these routes to your directory router file



// Upvote a directory
router.post('/upvote/:dirId', authenticate, async (req, res) => {
  try {
    const { dirId } = req.params;
    const userId = req.user?._id || req.body.userId; // Get user ID from auth middleware

    if (!userId) {
      return error(res, 401, { message: 'Please login to upvote' });
    }

    // Find directory
    const directory = await Directorymodel.findById(dirId);

    if (!directory) {
      return error(res, 404, { message: 'Directory not found' });
    }

    // Initialize upvotes and upvoterIds if they don't exist
    if (!directory.upvotes) {
      directory.upvotes = 0;
    }
    if (!directory.upvoterIds) {
      directory.upvoterIds = [];
    }

    const userIdString = String(userId);
    const hasUpvoted = directory.upvoterIds.some(id => String(id) === userIdString);

    if (hasUpvoted) {
      // Remove upvote
      directory.upvoterIds = directory.upvoterIds.filter(id => String(id) !== userIdString);
      directory.upvotes = Math.max(0, directory.upvotes - 1);
    } else {
      // Add upvote
      directory.upvoterIds.push(userId);
      directory.upvotes = (directory.upvotes || 0) + 1;
    }

    await directory.save();

    return response(res, 200, {
      message: hasUpvoted ? 'Upvote removed' : 'Directory upvoted successfully',
      upvotes: directory.upvotes,
      hasUpvoted: !hasUpvoted
    });

  } catch (e) {
    console.error('Directory upvote error:', e);
    return error(res, 500, { error: e, message: 'Error upvoting directory' });
  }
});

// Get directory upvote count
router.get('/upvotes/:dirId', async (req, res) => {
  try {
    const { dirId } = req.params;
    const userId = req.user?._id;

    const directory = await Directorymodel.findById(dirId).select('upvotes upvoterIds');

    if (!directory) {
      return error(res, 404, { message: 'Directory not found' });
    }

    const hasUpvoted = userId && directory.upvoterIds 
      ? directory.upvoterIds.some(id => String(id) === String(userId))
      : false;

    return response(res, 200, {
      upvotes: directory.upvotes || 0,
      hasUpvoted
    });

  } catch (e) {
    console.error('Get upvotes error:', e);
    return error(res, 500, { error: e, message: 'Error fetching upvotes' });
  }
});

// Get most upvoted directories
router.get('/trending/top', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    
    const topDirs = await Directorymodel.find({ isPublic: true })
      .sort({ upvotes: -1 })
      .limit(parseInt(limit))
      .select('Dirname desc upvotes isPublic createdAt');

    return response(res, 200, topDirs);

  } catch (e) {
    console.error('Get trending error:', e);
    return error(res, 500, { error: e, message: 'Error fetching trending directories' });
  }
});



//pdf

// In your notes.js or notes router file


router.get('/pdf/:id', async (req, res) => {
  try {
    const userid = req.params.id;
    const notes = await Notesmodel.findById(userid);
    console.log("Generating PDF for notes:", userid);

    if (!notes) {
      return res.status(404).json({ error: "Notes not found" });
    }
    
    const doc = new PDFDocument();
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=notes_${userid}.pdf`
    );

    const pdfDir = path.join(__dirname, "../pdf");
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const filepath = path.join(pdfDir, `${userid}.pdf`);
    console.log("PDF path:", filepath);
    const steam = fs.createWriteStream(filepath);
    doc.pipe(steam);

    notes.content.forEach((note, index) => {
      doc.fontSize(20).text(`${index + 1}. ${note.heading}`, { underline: true });
      doc.moveDown();
      
      console.log("Processing note:", index + 1);
      
      const plainDesc = convert(note.desc || '', {
  wordwrap: 80,
  preserveNewlines: true,
  selectors: [
    { selector: 'ul', options: { itemPrefix: '  • ' } },
    { selector: 'ol', options: { itemPrefix: '  ' } },
    // REMOVE the li selector - it's handled by ul/ol
    { selector: 'p', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    { selector: 'h1', options: { uppercase: false } },
    { selector: 'h2', options: { uppercase: false } },
  ]
});
      console.log("Converted description:", plainDesc);
      
      doc.fontSize(12).text(plainDesc);
      doc.moveDown();

      if (note.code) {
        doc.text('Code:', { underline: true });
        doc.moveDown();
        const plainCode = convert(note.code || '', {
          wordwrap: 100,
          preserveNewlines: true,
        });
        doc.font('Courier').fontSize(10).text(plainCode);
        doc.font('Helvetica');
        doc.moveDown();
      }
      
      doc.text('----------------------------------------');
      doc.moveDown();
    });

    doc.end();

    steam.on("finish", () => {
      res.download(filepath, "mynotes.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
        }

        fs.unlink(filepath, (unlinkErr) => {
          if (unlinkErr) {
            console.error("Error deleting PDF file:", unlinkErr);
          } else {
            console.log("PDF file deleted:", filepath);
          }
        });
      });
    });

  } catch (e) {
    console.error("PDF Generation Error:", e);
    return res.status(500).json({ error: e.message, message: "Error generating PDF" });
  }
});





module.exports = router;












