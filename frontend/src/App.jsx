// UploadCV.jsx
import { Route, Routes } from "react-router";
import { useAuthStore } from "./store/auth.store.js";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { Loader } from "lucide-react";
import ScraperPage from "./pages/ScraperPage.jsx";
import UploadCV from "./pages/UploadCVPage.jsx";
import {
  JobDetailPage,
  Login,
  Register,
  ReportPage,
  SuggestionsPage,
} from "./components/index.jsx";
import { HomePage, PublicLayout } from "./pages/index.jsx";
import PublicUser from "./pages/user/PublicUser.jsx";
import JobListPage from "./pages/JobListPage.jsx";
import UploadCVPage from "./pages/UploadCVPage.jsx";
import CompanyListPage from "./pages/CompanyListPage.jsx";
import CompanyDetailPage from "./pages/CompanyDetailPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

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
    <div>
      <ToastContainer position="top-right" autoClose={1000} limit={3} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<UploadCVPage />} />
        </Route>

        <Route path="user" element={<PublicUser />}>
          <Route index element={<HomePage />} />
          <Route index path="suggestion" element={<SuggestionsPage />} />
          <Route index path={"suggestion/job/:id"} element={<JobDetailPage />} />
          <Route index path="report" element={<ReportPage />} />
          <Route index path="jobs" element={<JobListPage />} />
          <Route path="companies" element={<CompanyListPage />} />
          <Route path="scraper" element={<ScraperPage />} />
        </Route>

        <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />

      </Routes>
    </div>
  );
}

export default App;
