// UploadCV.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router';
import { useAuthStore } from './store/auth.store.js';
import { useEffect } from 'react';
import { Loader } from "lucide-react";
import ScraperPage from './pages/ScraperPage.jsx';
import HomePage from './pages/HomePage.jsx';
import UploadCVPage from './pages/UploadCVPage.jsx';

function App() {
  const { isCheckingAuth, authUser, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  if (isCheckingAuth && !authUser) {
    
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <Routes>
      <Route index path='/' element={<HomePage/>} />
      <Route index path='/login' element={<></>} />
      <Route index path='/register' element={<></>} />
      <Route index path='/scraper' element={<ScraperPage/>} />
      <Route index path='/upload-cv' element={<UploadCVPage/>} />
    </Routes>
  );
}

export default App;
