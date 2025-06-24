import React, { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Home,
} from "lucide-react";

function UploadCVPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [jobs, setJobs] = useState([]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload only PDF or DOCX files");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((files) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setError(null);

    if (validateFile(file)) {
      const uploadedFile = {
        file,
        preview: file.name,
        size: formatFileSize(file.size),
      };
      setUploadedFile(uploadedFile);
      setUploadComplete(false);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileInput = (e) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadComplete(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("cv", uploadedFile.file);

    try {
      const response = await fetch("http://localhost:3000/api/v1/upload-cv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload CV");

      const data = await response.json();
      setJobs(data.jobs || []);
      setUploadComplete(true);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <FileText className="w-8 h-8 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">
                  CVPortal
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Home className="w-4 h-4 mr-1" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Upload Section */}
      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Upload Your CV
            </h1>
            <p className="text-gray-600 text-lg">
              Share your resume with us. We accept PDF and DOCX files up to
              10MB.
            </p>
          </div>

          {/* Upload Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Upload Area */}
            <div className="p-8">
              {!uploadedFile ? (
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
                    dragActive
                      ? "border-indigo-500 bg-indigo-50 scale-105"
                      : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                  } cursor-pointer`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileInput}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center">
                    <div
                      className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
                        dragActive ? "bg-indigo-200" : "bg-gray-100"
                      }`}
                    >
                      <Upload
                        className={`w-10 h-10 ${
                          dragActive ? "text-indigo-600" : "text-gray-400"
                        }`}
                      />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {dragActive
                        ? "Drop your file here"
                        : "Click to upload or drag and drop"}
                    </h3>

                    <p className="text-gray-500 mb-4">
                      PDF or DOCX files only, up to 10MB
                    </p>

                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        PDF
                      </span>
                      <span className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        DOCX
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* File Preview */}
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {uploadedFile.preview}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {uploadedFile.size}
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="ml-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Upload Status */}
                  {uploadComplete && (
                    <div className="flex items-center p-4 bg-green-50 rounded-xl">
                      <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                      <div>
                        <h4 className="text-sm font-semibold text-green-900">
                          Upload Complete!
                        </h4>
                        <p className="text-sm text-green-700">
                          Your CV has been successfully uploaded.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 flex items-center p-4 bg-red-50 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
                  <div>
                    <h4 className="text-sm font-semibold text-red-900">
                      Upload Error
                    </h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {uploadedFile && (
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={uploading || uploadComplete}
                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      uploadComplete
                        ? "bg-green-100 text-green-700 cursor-default"
                        : uploading
                        ? "bg-indigo-400 text-white cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
                    }`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : uploadComplete ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Uploaded Successfully
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Upload CV
                      </>
                    )}
                  </button>

                  <button
                    onClick={removeFile}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Choose Different File
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Your file will be processed securely and stored with encryption.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadCVPage;
