import {  useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type User } from "./AuthConext";
import { dataApi } from "../lib/api";
import { data } from "react-router-dom";


export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user,setUser]=useState<User| null>(null)
    const [loading,setLoading]=useState<boolean>(true);
    const[Error,setError]=useState<string|null>(null)
    const [check,setcheck]=useState<number>(0)

    useEffect( ()=>{
        dataApi.authCheck().then((res)=>{
            setUser(res)

        }).catch((requestError)=>{
            setUser(null)
            const message =
        requestError 
          ? requestError.message
          : "Authentication failed";
      setError(message);
        }).finally(()=>{
            setLoading(false)
        });
      
    },[check])

    const authenticate=async (action:Promise<any>):Promise<void>=>{
      setLoading(true);
    setError(null);
        try{
         await action;
            setcheck(prv=>prv+1)
        
    }catch(e:any){
         setUser(null)
            
      setError(e?.message || "Auth failed");
        throw e;
    }finally{
        setLoading(false);
    }


    }


   const values=useMemo(()=>(

{
            user,
            loading,
            Error,
            login:async(email:string,password:string)=> authenticate(dataApi.login(email,password)),
            signup:async(email:string,password:string)=> authenticate(dataApi.signup(email,password)),
            logout:()=>{return},
            sendOtp:async(email:string)=>authenticate(dataApi.SendOtp(email)),
            verifyOtp:async(email:string,otp:string)=>authenticate(dataApi.VerifyOtp(email,otp)),
}


   ),[user,loading,Error])



   

    return (<AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>)

}