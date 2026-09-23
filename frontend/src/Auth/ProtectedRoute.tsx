import React from 'react'
import { UseAuth } from '../Context/Useauth'
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
    const { user, loading } = UseAuth();
   
  if (loading) {
    return <div>Loading...</div>;
  }

  return (user ? <Outlet /> : <Navigate to="/login" replace />

  )
}
