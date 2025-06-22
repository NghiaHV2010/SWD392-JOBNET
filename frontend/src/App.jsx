import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UploadCVPage from "./pages/UploadCVPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload-cv" element={<UploadCVPage />} />
      </Routes>
    </Router>
  );
}

export default App;
