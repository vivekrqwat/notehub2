import { Request, Response, NextFunction, RequestHandler } from "express";
const AsyncHandler=(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler=>{
    return (req:Request,res:Response,next:NextFunction):void=>{
        Promise.resolve(fn(req,res,next)).catch((e)=>next(e))
    }
}
export default AsyncHandler