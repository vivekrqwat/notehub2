import { Response } from "express"


const setResponse = (res:Response, message: any, statuscode: number) => {
    return res.status(statuscode).json({ message })
}
export default setResponse