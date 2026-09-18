import { useContext } from "react";
import { AuthContext } from "./AuthConext";

export function UseAuth(){
    const context=useContext(AuthContext)
    if(!context)
        throw new Error("userAuth be inside AUth Provider")
    return context
}