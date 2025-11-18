import './App.css';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { UserStore } from './store/Userstroe.jsx';

import { Layout } from './pages/Layout';
import HomePage from './Components/MainBox';
import Discussion from './Components/Disscusiono';
import Directory from './Components/Directory';
import Notes from './Components/Notes';
import Signup from './pages/Signup';
import Login from './pages/login';
import Loading from './pages/Loading.jsx';
import Collaborative from './Components/Collaborative.jsx';
import ProfilePage from './pages/profilepage.jsx';
  import { ToastContainer } from 'react-toastify';

export default function App() {
  const { user, checkAuth,isAuth,loading } = UserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
// console.log("user check",user)

if (loading) return <Loading />;


  return (
  <div className="dark min-h-screen bg-[#0a0a0a] text-gray-100">

      <BrowserRouter>
        <ToastContainer />
        <Routes>{
      user?
      
        (<>
        <Route path="/" element={<Layout /> }>
          <Route index element={user ? <HomePage />: <Navigate to="/login" />} />
          <Route path="post" element={user ?<Discussion />: <Navigate to="/login" />} />
          <Route path="dir" element={<Directory />} />
          <Route path="notes" element={<Notes />} />
           <Route path="collab" element={<Collaborative></Collaborative>} />
        </Route>
          <Route path="/profile/:id"  element={user ? <ProfilePage></ProfilePage>: <Navigate to="/" />} ></Route>

        </>)
      :<Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />}
    
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
         <Route
          path="*"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
      </Routes>
      </BrowserRouter>
    </div>
  );
}
