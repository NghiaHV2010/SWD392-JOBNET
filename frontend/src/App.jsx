// UploadCV.jsx
import React, { useState } from "react";
import axios from "axios";
import { Route, Routes } from "react-router";
import { useAuthStore } from "./store/auth.store.js";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import ScraperPage from "./pages/ScraperPage.jsx";
import {
  Login,
  Register,
  ReportPage,
  SuggestionsPage,
} from "./components/index.jsx";
import { HomePage, PublicLayout } from "./pages/index.jsx";
import PublicUser from "./pages/user/PublicUser.jsx";

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
    );
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route path="user" element={<PublicUser />}>
        <Route index element={<HomePage />} />
        <Route index path="scraper" element={<ScraperPage />} />
        <Route index path="suggestion" element={<SuggestionsPage />} />
        <Route index path="report" element={<ReportPage />} />
      </Route>
    </Routes>
  );
}

export default App;
