import React from "react";
import { Link } from "react-router-dom";
import { FileText, Upload, Users, Award, ArrowRight } from "lucide-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <FileText className="w-8 h-8 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">
                  CVPortal
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/upload-cv"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Upload CV
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-8">
            <FileText className="w-10 h-10 text-indigo-600" />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Career Journey
            <span className="block text-indigo-600">Starts Here</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Upload your CV and let us help you find the perfect opportunity. Our
            platform connects talented professionals with leading companies
            worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/upload-cv"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload Your CV
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-indigo-300 hover:text-indigo-600 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose CVPortal?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We make it easy to showcase your skills and connect with
            opportunities that match your career goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <Upload className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Easy Upload
            </h3>
            <p className="text-gray-600">
              Simply drag and drop your CV or click to upload. We support PDF
              and DOCX formats up to 10MB.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Connect with Employers
            </h3>
            <p className="text-gray-600">
              Get matched with top companies looking for professionals with your
              skills and experience.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Career Growth
            </h3>
            <p className="text-gray-600">
              Access resources and opportunities that help you advance your
              career to the next level.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their dream jobs
            through our platform.
          </p>
          <Link
            to="/upload-cv"
            className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload Your CV Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <FileText className="w-6 h-6 text-indigo-400 mr-2" />
              <span className="text-lg font-semibold">CVPortal</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 CVPortal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
