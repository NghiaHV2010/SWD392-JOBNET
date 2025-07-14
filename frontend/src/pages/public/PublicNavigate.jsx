import React from "react";
import { Button } from "antd";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export const PublicNavigate = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-2xl font-bold text-gray-900 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Job Portal AI
            </h1>
            <div className="flex gap-4">
              <Button
                type={currentPath === "/" ? "primary" : "default"}
                onClick={() => navigate("/")}
              >
                Trang chủ
              </Button>
              <Button
                type={currentPath === "/login" ? "primary" : "default"}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                type={currentPath === "/register" ? "primary" : "default"}
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </nav>
      {/* Page Content */}
      <Outlet />
    </div>
  );
};

export default PublicNavigate;
