import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Building2,
  FileText,
  Home,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader,
  ExternalLink,
  ArrowRight,
  Globe,
  Factory,
  Briefcase,
} from "lucide-react";

// Company service to fetch from your API
const fetchCompanies = async (page = 1, search = "") => {
  try {
    const baseUrl = "http://localhost:3000/api/v1";

    const params = new URLSearchParams({
      page: page,
      limit: 15,
      search: search,
    });

    const response = await fetch(`${baseUrl}/company?${params}`);

    if (!response.ok) {
      throw new Error("API not available");
    }

    const data = await response.json();

    // Assuming the API returns data in format: { data: [...], total: number }
    return {
      companies: data.data || [],
      total: data.total || data.data?.length || 0,
      page: page,
      totalPages: Math.ceil((data.total || data.data?.length || 0) / 15),
    };
  } catch (error) {
    console.log("API not available, using mock data");
    return getMockCompanies(page, search);
  }
};

// Mock data for development (when API is not available)
const getMockCompanies = (page = 1, search = "") => {
  const mockCompanies = [
    {
      id: "00fe4235-5896-4d57-9e21-00681cf7476b",
      company_name: "Nhà Máy Sữa Đậu Nành Vinasoy Bắc Ninh (VNB)",
      email: null,
      address: "Đường TS5. KCN Tiên Sơn. Đồng Nguyên, Từ Sơn, Bắc Ninh",
      description:
        "I. Vinasoy - Top 5 Nhà sản xuất Sữa Đậu nành lớn nhất thế giới\nVinasoy hiện là công ty dẫn đầu ngành hàng sữa đậu nành bao bì giấy ở Việt Nam với hơn 80% thị phần và đã có mặt tại các nước: Nhật Bản, TQ, Mỹ.",
      website: "https://vinasoycorp.vn/",
      field: "Sản xuất",
      imageUrl:
        "https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/55cdb8ef260ccf7110f83d007d631414-5fd3174105f21.jpg",
      sourceUrl:
        "https://www.topcv.vn/cong-ty/nha-may-sua-dau-nanh-vinasoy-bac-ninh-vnb/50430.html",
      source_name: "TOPCV",
      employees: null,
      created_at: "2025-06-21T20:44:46.601Z",
      updated_at: "2025-06-22T06:35:32.617Z",
    },
    {
      id: "11fe4235-5896-4d57-9e21-00681cf7476c",
      company_name: "Công ty TNHH Samsung Electronics Việt Nam",
      email: "hr@samsung.vn",
      address: "Khu Công nghiệp Yên Phong, Bắc Ninh",
      description:
        "Samsung Electronics Việt Nam là một trong những nhà sản xuất điện tử hàng đầu tại Việt Nam, chuyên sản xuất điện thoại thông minh, máy tính bảng và các thiết bị điện tử tiêu dùng.",
      website: "https://www.samsung.com/vn/",
      field: "Điện tử",
      imageUrl:
        "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=140&h=140&fit=crop",
      sourceUrl:
        "https://www.topcv.vn/cong-ty/samsung-electronics-vietnam/12345.html",
      source_name: "TOPCV",
      employees: "50000+",
      created_at: "2025-06-20T15:30:00.000Z",
      updated_at: "2025-06-22T08:00:00.000Z",
    },
  ];

  // Filter by search term
  let filteredCompanies = mockCompanies;
  if (search) {
    filteredCompanies = mockCompanies.filter(
      (company) =>
        company.company_name.toLowerCase().includes(search.toLowerCase()) ||
        company.field.toLowerCase().includes(search.toLowerCase()) ||
        (company.address &&
          company.address.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Pagination
  const startIndex = (page - 1) * 15;
  const endIndex = startIndex + 15;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  return {
    companies: paginatedCompanies,
    total: filteredCompanies.length,
    page: page,
    totalPages: Math.ceil(filteredCompanies.length / 15),
  };
};

function CompanyListPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCompanies, setTotalCompanies] = useState(0);

  // Load companies
  const loadCompanies = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const data = await fetchCompanies(page, search);
      setCompanies(data.companies || []);
      setTotalPages(data.totalPages || 1);
      setTotalCompanies(data.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error loading companies:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadCompanies(1, "");
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    loadCompanies(1, searchTerm);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadCompanies(page, searchTerm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Truncate text
  const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
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
              <Link to="/jobs" className="text-gray-600 hover:text-indigo-600">
                Việc làm
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
            Danh sách công ty
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Đang tải..."
              : `Có ${totalCompanies} công ty - Trang ${currentPage} / ${totalPages}`}
          </p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên công ty, lĩnh vực, địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
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

        {/* Companies List */}
        {!loading && (
          <div className="space-y-6">
            {companies.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy công ty
                </h3>
                <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              companies.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    {/* Company Logo */}
                    <div className="flex-shrink-0">
                      {company.imageUrl ? (
                        <img
                          src={company.imageUrl}
                          alt={company.company_name}
                          className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className={`w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center ${
                          company.imageUrl ? "hidden" : "flex"
                        }`}
                      >
                        <Building2 className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>

                    {/* Company Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {company.company_name}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            {company.field && (
                              <div className="flex items-center">
                                <Factory className="w-4 h-4 mr-1" />
                                {company.field}
                              </div>
                            )}
                            {company.address && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {company.address}
                              </div>
                            )}
                            {company.employees && (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {company.employees} nhân viên
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Source Badge */}
                        {company.source_name && (
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {company.source_name}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {company.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {truncateText(company.description, 300)}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex flex-wrap items-center gap-4">
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Website
                          </a>
                        )}

                        <Link
                          to={`/companies/${company.id}`}
                          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <ArrowRight className="w-4 h-4 mr-1" />
                          Xem chi tiết
                        </Link>

                        <Link
                          to={`/jobs?company=${encodeURIComponent(
                            company.company_name
                          )}`}
                          className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
                        >
                          <Briefcase className="w-4 h-4 mr-1" />
                          Việc làm
                        </Link>

                        {company.sourceUrl && (
                          <a
                            href={company.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-gray-500 hover:text-gray-700 text-sm"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Nguồn gốc
                          </a>
                        )}
                      </div>

                      {/* Contact Info */}
                      {company.email && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-sm text-gray-600">
                            <strong>Email:</strong> {company.email}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && companies.length > 0 && totalPages > 1 && (
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

export default CompanyListPage;
