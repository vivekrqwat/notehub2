import './App.css';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useState } from 'react';
import { UserStore } from './store/Userstroe.jsx';
import { ToastContainer } from 'react-toastify';

// ============================================
// EAGER LOAD - Critical components (loaded immediately)
// ============================================
import { Layout } from './pages/Layout';
import Loading from '@/pages/Loading.jsx';
import Login from '@/pages/login.jsx';
import Signup from '@/pages/Signup.jsx';

// ============================================
// LAZY LOAD - Route components (code split by route)
// ============================================
// Home & Main Features
const HomePage = lazy(() => import('@/components/MainBox.jsx'));
const Discussion = lazy(() => import('@/components/Disscusiono.jsx'));
const Directory = lazy(() => import('@/components/Directory.jsx'));
const Notes = lazy(() => import('@/components/Notes.jsx'));
const Collaborative = lazy(() => import('@/components/Collaborative.jsx'));

// Profile & Directory Pages
const ProfilePage = lazy(() => import('@/pages/profilepage.jsx'));
const AllDir = lazy(() => import('@/components/AllDir.jsx'));
const Alluser = lazy(() => import('@/components/Alluser.jsx'));

// ============================================
// LOADING FALLBACK COMPONENT
// ============================================
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loading />
  </div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function App() {
  const { user, checkAuth, initializeUser, loading } = UserStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      initializeUser();
      await checkAuth();
      if (mounted) setReady(true);
    };
    init();
    return () => {
      mounted = false;
    };
  }, [initializeUser, checkAuth]);

  return (
    <>
      {/* ToastContainer stays outside all conditionals */}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Initial auth loading */}
      {(!ready || loading) ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-background text-foreground">
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* ============================================ */}
                {/* PUBLIC ROUTES - Accessible without login */}
                {/* ============================================ */}
                <Route
                  path="/login"
                  element={!user ? <Login /> : <Navigate to="/" replace />}
                />
                <Route
                  path="/signup"
                  element={!user ? <Signup /> : <Navigate to="/" replace />}
                />

                {/* ============================================ */}
                {/* PROTECTED ROUTES - Only for logged-in users */}
                {/* ============================================ */}
                {user && (
                  <>
                    <Route path="/" element={<Layout />}>
                      {/* Home Page */}
                      <Route index element={<HomePage />} />
                      
                      {/* Discussion/Posts */}
                      <Route path="post" element={<Discussion />} />
                      
                      {/* Directory Features */}
                      <Route path="dir" element={<Directory />} />
                      <Route path="alldir" element={<AllDir />} />
                      
                      {/* Notes */}
                      <Route path="notes/:id" element={<Notes />} />
                      
                      {/* Collaboration */}
                      <Route path="collab" element={<Collaborative />} />
                      
                      {/* Users */}
                      <Route path="allusers" element={<Alluser />} />
                    </Route>

                    {/* Profile Page - Outside Layout */}
                    <Route path="/profile/:id" element={<ProfilePage />} />
                  </>
                )}

                {/* ============================================ */}
                {/* CATCH-ALL - Redirect unknown routes */}
                {/* ============================================ */}
                <Route
                  path="*"
                  element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />}
                />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}