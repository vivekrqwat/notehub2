const DirCreate=async(req,res)=>{
  
    
    const dir=await new Directorymodel(req.body)
 
    const savedir=await dir.save();
    console.log("save created",savedir)
   
    return response(res,200,savedir)

    
    
}

const GetAllDir=async(req,res)=>{
   
       
        const alldir=await Directorymodel.find({isPublic:true}).lean();
     
        return response(res,200,alldir)
   
}



module.exports={DirCreate,GetAllDir}