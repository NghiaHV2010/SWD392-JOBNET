import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  FileText,
  Users,
  Calendar,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Loader,
  AlertCircle,
  Share2,
  Bookmark,
  Send,
} from "lucide-react";

// API service to fetch job by ID
const fetchJobById = async (jobId) => {
  try {
    // Replace with your actual API endpoint
    const baseUrl = "http://localhost:8080/api";

    const response = await fetch(`${baseUrl}/job/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("API not available");
    }

    const data = await response.json();

    if (data.statusCode === "OK" && data.jobDto) {
      return data.jobDto;
    }

    throw new Error("Job not found");
  } catch (error) {
    console.log("API not available, using mock data");
    return getMockJobDetail(jobId);
  }
};

// Mock data for development
const getMockJobDetail = (jobId) => {
  const mockJob = {
    id: jobId,
    title:
      "CHUYÊN VIÊN TƯ VẤN TÀI CHÍNH & PHÁT TRIỂN KHCN SHINHAN BANK HÀ NỘI (Không Yêu Cầu KN)",
    salary: "10 - 35 triệu",
    description: `Lương cơ bản + Phụ cấp:
- Level Chuyên viên bậc 1 - Sale officer: 9.730.000; 10.100.000; 10.500.000 hoặc 10.470.000 + Thưởng Kinh doanh
- Level Chuyên viên bậc 2 - Senior Sale Officer: 12.200.000 hoặc 12.880.000

Mô tả công việc:
• Tư vấn các sản phẩm tài chính của Shinhan Bank cho khách hàng cá nhân
• Phát triển và duy trì mối quan hệ với khách hàng
• Đạt chỉ tiêu kinh doanh được giao
• Hỗ trợ khách hàng trong quá trình sử dụng dịch vụ
• Tham gia các hoạt động marketing và sự kiện của ngân hàng

Yêu cầu công việc:
• Tốt nghiệp Đại học các chuyên ngành liên quan
• Có kỹ năng giao tiếp tốt, thuyết phục khách hàng
• Có tinh thần tr책nhiệm cao, chịu được áp lực công việc
• Ưu tiên ứng viên có kinh nghiệm trong lĩnh vực tài chính ngân hàng

Quyền lợi:
• Lương cơ bản + thưởng kinh doanh hấp dẫn
• Bảo hiểm sức khỏe cao cấp
• Đào tạo chuyên môn định kỳ
• Cơ hội thăng tiến rõ ràng
• Môi trường làm việc chuyên nghiệp`,
    endDate: "2025-07-20",
    applyLocation: "Hà Nội",
    experience: "Dưới 1 năm",
    formOfWork: "Toàn thời gian",
    jobLevel: "Nhân viên",
    education: "Trung cấp trở lên",
    field:
      "Chuyên môn Quản lý khách hàng cá nhân/doanh nghiệp, Direct Sales, Telesales, B2B, Ngân hàng, Chứng khoán, Tài chính, Có hỗ trợ Data, Nghỉ thứ 7, Phát âm chuẩn, Đãi ngộ tốt",
    quantity: 2,
    sourceUrl:
      "https://www.topcv.vn/viec-lam/chuyen-vien-tu-van-tai-chinh-phat-trien-khcn-shinhan-bank-ha-noi-khong-yeu-cau-kn/1773338.html",
    createdAt: "2025-06-22T02:48:04.126Z",
    updatedAt: "2025-06-22T02:48:04.126Z",
    companyName: "Shinhan Bank",
    companyLogo:
      "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
  };

  return mockJob;
};

function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load job details
  useEffect(() => {
    const loadJobDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const jobData = await fetchJobById(id);
        setJob(jobData);
      } catch (err) {
        setError("Không thể tải thông tin công việc");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadJobDetail();
    }
  }, [id]);

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

  // Handle apply
  const handleApply = async () => {
    setApplying(true);
    // Simulate apply process
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setApplying(false);
    alert("Ứng tuyển thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
  };

  // Handle save job
  const handleSaveJob = () => {
    setSaved(!saved);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã copy link vào clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center">
          <Loader className="w-8 h-8 text-indigo-600 animate-spin mr-3" />
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy công việc
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/jobs"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start">
                  {job.companyLogo && (
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                  )}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                    </h1>
                    {job.companyName && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building2 className="w-4 h-4 mr-1" />
                        {job.companyName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSaveJob}
                    className={`p-2 border rounded-lg ${
                      saved
                        ? "text-indigo-600 border-indigo-300 bg-indigo-50"
                        : "text-gray-400 hover:text-gray-600 border-gray-300"
                    }`}
                  >
                    <Bookmark
                      className={`w-5 h-5 ${saved ? "fill-current" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {/* Job Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{job.applyLocation}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>{formatSalary(job.salary)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <span>{job.experience}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Hạn: {formatDate(job.endDate)}</span>
                </div>
              </div>

              {/* Skills/Field */}
              {job.field && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Lĩnh vực & Kỹ năng
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.field.split(",").map((skill, index) => (
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
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Mô tả công việc
              </h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                  {job.description}
                </pre>
              </div>

              {job.sourceUrl && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href={job.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Xem chi tiết tại nguồn gốc
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Apply Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-indigo-600 mb-1">
                  {formatSalary(job.salary)}
                </div>
                <div className="text-sm text-gray-500">Mức lương</div>
              </div>

              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {applying ? (
                  <div className="flex items-center justify-center">
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Đang ứng tuyển...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    Ứng tuyển ngay
                  </div>
                )}
              </button>

              <Link
                to="/upload-cv"
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 block text-center"
              >
                Upload CV
              </Link>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin chi tiết
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <GraduationCap className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Học vấn</div>
                    <div className="font-medium">{job.education}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Cấp bậc</div>
                    <div className="font-medium">{job.jobLevel}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">
                      Hình thức làm việc
                    </div>
                    <div className="font-medium">{job.formOfWork}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Số lượng tuyển</div>
                    <div className="font-medium">{job.quantity} người</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Hạn nộp hồ sơ</div>
                    <div className="font-medium">{formatDate(job.endDate)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;
