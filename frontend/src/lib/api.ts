import axios from "axios"
import ALLPATH from "../ALLPATH";
import type { User } from "../Context/AuthConext";

const API="http://localhost:3004"

const axiosINstance=axios.create({
    baseURL:API,
    withCredentials:true,
    headers:{
        "Content-Type":"application/json"
    }
})


export type ApiDirectory = {
  _id: string;
  name: string;
  uid: string;
};

export type ApiNote = {
  _id: string;
  title: string;
  desc: string;
  dirid: string;
  uid: string;
};


// async function  Request<T>(path:string,options:RequestInit={},token?:string){

// //     const response=await fetch(`${API}/${path}`,{
// //         ...options,
// //         credentials:"include",
// //         headers:{
// //             "Content-Type":"application/json",
// //             ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //               ...options.headers,

// //     }
// // })


// }
const{Login,GETDir, Notes_Route}=ALLPATH
  interface NotesOBJ{
    tiite:string,
    desc:string,
  
    uid:string
  }



export const api={
    login:async (email:string,password:string)=>{
        const response=axiosINstance.post<{mesages:string}>(Login,{email,password})
        return (await response).data.mesages

    },
    signup:async (email:string,password:string)=>{
        const response=axiosINstance.post<{message:string}>(`/notehub/loginuser/reg1`,{email,password})
        return (await response).data.message

    },
    getDirectories:async (uid:string,)=>{
        const response=await axiosINstance.get<{message:ApiDirectory[]}>(`${GETDir}/${uid}`)
        console.log("=",response.data.message)
        return ( response).data.message

    },
    CreateDirectories:async(name:string,uid:string)=>{
        const response =axiosINstance.post<{message:string}>(`${GETDir}`,{uid:uid,name:name})
          return (await response).data.message
    }
    ,
    getNotes:async (dirid:string,)=>{
        const response=axiosINstance.get<{message:ApiNote[]}>(`${ Notes_Route}/${dirid}`)
        return (await response).data.message

    },
  
    CreateNotes:async (dirid:string,message:NotesOBJ)=>{
        const response=axiosINstance.post<{message:string}>(`${ Notes_Route}/${dirid}`,message)
        return (await response).data.message

    },
     deleteNote: async (noteId: string) => {
    const response = await axiosINstance.delete<{ message: string }>(`/notehub/notes/${noteId}`, {
      data: { id: noteId }
    });
    return response.data.message;
  },
  authCheck:async()=>{
    const response=await axiosINstance.get<{message:User}>(`/notehub/auth/me`)
    return response.data.message
  }

}

function asArray<T>(value:T[]| undefined):T[]{
    return Array.isArray(value)?value:[]; 
}

export const dataApi={
    ... api,
    getDirectories:async (userid:string)=>asArray(await api.getDirectories(userid)),
    getNotes:async (dirid:string)=>asArray(await api.getNotes(dirid)),

}

