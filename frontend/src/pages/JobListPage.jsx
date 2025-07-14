import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  FileText,
  Home,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Loader,
  ExternalLink,
} from "lucide-react";

// Job service to fetch from your API
const fetchJobs = async (page = 1, search = "", companyName = "") => {
  try {
    // Replace with your actual API endpoint
    const baseUrl = "https://your-api-endpoint.com/api";

    // If searching by company name
    if (companyName) {
      const response = await fetch(`${baseUrl}/job/get-by-company-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: companyName,
        }),
      });

      if (!response.ok) {
        throw new Error("API not available");
      }

      const data = await response.json();

      if (data.statusCode === "OK" && data.jobDtos) {
        // Apply pagination to the results
        const startIndex = (page - 1) * 15;
        const endIndex = startIndex + 15;
        const paginatedJobs = data.jobDtos.slice(startIndex, endIndex);

        return {
          jobs: paginatedJobs,
          total: data.jobDtos.length,
          page: page,
          totalPages: Math.ceil(data.jobDtos.length / 15),
        };
      }
    }

    // For general search or all jobs
    const params = new URLSearchParams({
      page: page,
      limit: 15,
      search: search,
    });

    const response = await fetch(`${baseUrl}/jobs?${params}`);

    if (!response.ok) {
      throw new Error("API not available");
    }

    return await response.json();
  } catch (error) {
    console.log("API not available, using mock data");
    return getMockJobs(page, search);
  }
};

// Mock data for development (when API is not available)
const getMockJobs = (page = 1, search = "") => {
  const mockJobs = [
    {
      id: "65ac6270-2b40-4400-8eeb-727749e2a375",
      title:
        "CHUYÊN VIÊN TƯ VẤN TÀI CHÍNH & PHÁT TRIỂN KHCN SHINHAN BANK HÀ NỘI (Không Yêu Cầu KN)",
      salary: "10 - 35 triệu",
      description:
        "Lương cơ bản + Phụ cấp:\n- Level Chuyên viên bậc 1 - Sale officer: 9.730.000; 10.100.000; 10.500.000 hoặc 10.470.000 + Thưởng Kinh doanh\n- Level Chuyên viên bậc 2 - Senior Sale Officer: 12.200.000 hoặc 12.880.000",
      endDate: "2025-07-20",
      applyLocation: "Hà Nội",
      experience: "Dưới 1 năm",
      formOfWork: "Toàn thời gian",
      jobLevel: "Nhân viên",
      education: "Trung cấp trở lên",
      field:
        "Chuyên môn Quản lý khách hàng cá nhân/doanh nghiệp, Direct Sales, Telesales, B2B, Ngân hàng, Chứng khoán, Tài chính, Có hỗ trợ Data, Nghỉ thứ 7, Phát âm chuẩn, Đãi ngộ tốt chăy",
      quantity: 2,
      sourceUrl:
        "https://www.topcv.vn/viec-lam/chuyen-vien-tu-van-tai-chinh-phat-trien-khcn-shinhan-bank-ha-noi-khong-yeu-cau-kn/1773338.html?ta_source=JoblistKnowCompany_LinkDetail",
      createdAt: "2025-06-22T02:48:04.126Z",
      updatedAt: "2025-06-22T02:48:04.126Z",
    },
    {
      id: "6592a070-e198-44cd-9644-504f24714ed7",
      title:
        "[ Quận 7 ] Chăm Sóc Khách Hàng Qua Điện Thoại - Tổng Đài Viên 24/7 (Không Yêu Cầu Kinh Nghiệm)",
      salary: "8 - 15 triệu",
      description:
        "Nhận và thực hiện các cuộc gọi tư vấn, hỗ trợ khách hàng qua điện thoại",
      endDate: "2025-08-15",
      applyLocation: "Hồ Chí Minh",
      experience: "Không yêu cầu",
      formOfWork: "Toàn thời gian",
      jobLevel: "Nhân viên",
      education: "Trung học phổ thông",
      field: "Chăm sóc khách hàng, Call center, Telesales",
      quantity: 5,
      sourceUrl:
        "https://www.topcv.vn/viec-lam/cham-soc-khach-hang-qua-dien-thoai/1234567.html",
      createdAt: "2025-06-20T10:30:00.000Z",
      updatedAt: "2025-06-20T10:30:00.000Z",
    },
  ];

  // Filter by search term
  let filteredJobs = mockJobs;
  if (search) {
    filteredJobs = mockJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.field.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Pagination
  const startIndex = (page - 1) * 15;
  const endIndex = startIndex + 15;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  return {
    jobs: paginatedJobs,
    total: filteredJobs.length,
    page: page,
    totalPages: Math.ceil(filteredJobs.length / 15),
  };
};

function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [companySearch, setCompanySearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // Load jobs
  const loadJobs = async (page = 1, search = "", company = "") => {
    setLoading(true);
    try {
      const data = await fetchJobs(page, search, company);
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
      setTotalJobs(data.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadJobs(1, "", "");
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadJobs(1, searchTerm, companySearch);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadJobs(page, searchTerm, companySearch);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Format salary
  const formatSalary = (salary) => {
    if (!salary) return "Thỏa thuận";
    return salary;
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <FileText className="w-8 h-8 text-indigo-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">CVPortal</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-indigo-600"
              >
                <Home className="w-4 h-4 mr-1" />
                Trang chủ
              </Link>
              <Link
                to="/upload-cv"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Upload CV
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tìm việc làm
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Đang tải..."
              : `Có ${totalJobs} việc làm - Trang ${currentPage} / ${totalPages}`}
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo vị trí, kỹ năng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm theo tên công ty..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
            <span className="text-gray-600">Đang tải...</span>
          </div>
        )}

        {/* Jobs List */}
        {!loading && (
          <div className="space-y-4">
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy việc làm
                </h3>
                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.applyLocation || "Không xác định"}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {formatSalary(job.salary)}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.experience || "Không yêu cầu"}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Hạn: {formatDate(job.endDate)}
                        </div>
                      </div>

                      {job.field && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {job.field
                              .split(",")
                              .slice(0, 5)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                >
                                  {skill.trim()}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}

                      <p className="text-gray-600 line-clamp-3">
                        {job.description?.substring(0, 200)}...
                      </p>

                      {job.sourceUrl && (
                        <div className="mt-3">
                          <a
                            href={job.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Xem chi tiết tại nguồn
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="ml-6 flex flex-col gap-2">
                      <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Ứng tuyển
                      </button>
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Lưu việc
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && jobs.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={`px-4 py-2 border rounded-lg ${
                  page === currentPage
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : page === "..."
                    ? "border-gray-300 cursor-default"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobListPage;
