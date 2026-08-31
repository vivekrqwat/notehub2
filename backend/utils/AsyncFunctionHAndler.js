const AsynFuncHandler=(fn)=>{
    return (req,res,next)=>{return Promise.resolve(fn(req,res,next)).catch((e)=>next(e))}
}
module.exports=AsynFuncHandler