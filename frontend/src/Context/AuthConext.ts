import { createContext } from "react";

export type User={
email:string,
id:string
}
type AuthContextValue={
    // token:string | null,
    loading:boolean,
    Error:string|null,
    user:User | null,
    login:(email:string,password:string)=>Promise<void>,
    signup:(email:string,password:string)=>Promise<void>,
    logout:()=>void
}
export const AuthContext=createContext<AuthContextValue| null>(null)