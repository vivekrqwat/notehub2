import React, { useEffect, useState } from 'react'
import { UseAuth } from '../Context/Useauth'
import { Navigate, Outlet } from 'react-router-dom';
import { SpinnerCustom } from '../lib/Loading';

export default function ProtectedRoute() {
    const { user, loading } = UseAuth();
    const [time,settime]=useState(false)
    useEffect(()=>{
      const id=window.setTimeout(()=>{settime(true)},500)
      return ()=>clearInterval(id)
    },[])
   
  if (!time) {
    

    return <SpinnerCustom ></SpinnerCustom>
  }

  return (user ? <Outlet /> : <Navigate to="/login" replace />

  )
}
