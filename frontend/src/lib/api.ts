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
export type Task = {
  _id?: string;
  title: string;
  desc: string;
  email: string;
  Date: string;
  time: string;
  uid: string;
};

export type ApiNote = {
  _id: string;
  title: string;
  desc: string;
  dirid: string;
  uid: string;
};

export type NotesPageResponse = {
  items: ApiNote[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
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
    getNotes:async (dirid:string,page:string)=>{
      const response=await axiosINstance.get<{message: NotesPageResponse | ApiNote[]}>(`${ Notes_Route}/${dirid}?page=${page}&limit=10`)
      const message = response.data.message;
      return Array.isArray(message)
        ? { items: message, pagination: { totalItems: message.length, totalPages: 1, currentPage: Number(page), limit: 10 } }
        : message;

    },
  
    CreateNotes:async (dirid:string,message:Pick<ApiNote, "title" | "desc" | "uid">,)=>{
        const response=await axiosINstance.post<{message:ApiNote}>(`/notehub/notes/${dirid}`,message)
        console.log("notes",response.data)
        return ( response).data.message

    },
    EditNotes:async(noteid:string,message:Pick<ApiNote, "title" | "desc" | "uid">)=>{
      const response=await axiosINstance.put(`/notehub/notes/${noteid}`,message)
      return response.data.message
    }
    ,
     deleteNote: async (noteId: string) => {
    const response = await axiosINstance.delete<{ message: string }>(`/notehub/notes/${noteId}`, {
      data: { id: noteId }
    });
    return response.data.message;
  },
  deleteDir:async(dirid:string)=>{
    const response =await axiosINstance.delete<{message:string}>(`/notehub/dir/${dirid}`);
      return response.data.message
  }
  ,
  authCheck:async()=>{
    const response=await axiosINstance.get<{message:User}>(`/notehub/auth/me`)
    return response.data.message
  },
  SendOtp:async(email:string)=>{
    const response=await axiosINstance.post<{message:string}>("/notehub/loginuser/otp-handler",{email})
    return response.data.message
  },
  VerifyOtp:async(email:string,otp:string)=>{
    const response=await axiosINstance.post<{message:string}>("/notehub/loginuser/verify",{email,otp})
    return response.data.message
  },
  GetTask:async(userid:string,page:string,limit:string)=>{
    const response=await axiosINstance.get<{message:Task[]}>(`/notehub/task/${userid}?page=${page}&limit=${limit}`)
    return response.data.message
  },
  CreateTask:async(message:Omit<Task, "_id">)=>{
    const response=await axiosINstance.post<{message:Task}>(`/notehub/task/`,message)
    return response.data.message
  },
  EditTask:async(message:Task)=>{
    const response=await axiosINstance.put<{message:Task}>(`/notehub/task/`,message)
     return response.data.message
  },
  DeleteTask:async(taskid:string)=>{
    const response=await axiosINstance.delete<{message:string}>(`/notehub/task/${taskid}`)
    return response.data.message
  }


}

function asArray<T>(value:T[]| undefined):T[]{
    return Array.isArray(value)?value:[]; 
}

export const dataApi={
    ... api,
    getDirectories:async (userid:string)=>asArray(await api.getDirectories(userid)),
    getNotes:async (dirid:string, page:string)=>api.getNotes(dirid, page),

}

