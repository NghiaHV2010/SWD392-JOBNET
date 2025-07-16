import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Building2,
  FileText,
  Users,
  Calendar,
  Globe,
  ExternalLink,
  Loader,
  AlertCircle,
  Share2,
  Bookmark,
  Factory,
  Mail,
  Briefcase,
  Award,
  Target,
} from "lucide-react";

// API service to fetch company by ID
const fetchCompanyById = async (companyId) => {
  try {
    // Replace with your actual API endpoint
    const baseUrl = "http://localhost:3000/api/v1";

    const response = await fetch(`${baseUrl}/company/${companyId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("API not available");
    }

    const data = await response.json();

    if (data.data) {
      return data.data;
    }

    throw new Error("Company not found");
  } catch (error) {
    console.log("API not available, using mock data");
    return getMockCompanyDetail(companyId);
  }
};

// Mock data for development
const getMockCompanyDetail = (companyId) => {
  const mockCompany = {
    id: companyId,
    company_name: "Nhà Máy Sữa Đậu Nành Vinasoy Bắc Ninh (VNB)",
    email: "hr@vinasoy.com.vn",
    address: "Đường TS5. KCN Tiên Sơn. Đồng Nguyên, Từ Sơn, Bắc Ninh",
    description: `I. Vinasoy - Top 5 Nhà sản xuất Sữa Đậu nành lớn nhất thế giới

Vinasoy hiện là công ty dẫn đầu ngành hàng sữa đậu nành bao bì giấy ở Việt Nam với hơn 80% thị phần và đã có mặt tại các nước: Nhật Bản, TQ, Mỹ. Tại Việt Nam, người tiêu dùng biết đến Vinasoy với các sản phẩm như: Fami Canxi, Fami Nguyên Chất, Fami Go, Vinasoy. 

Ngoài ra, Vinasoy còn được biết đến với các thành tích như:
• Top 5 Nhà Sản xuất Sữa Đậu nành lớn nhất thế giới
• Thương hiệu Sữa Đậu nành số 1 được chọn mua tại Việt Nam
• Top 10 Nhãn hiệu nổi tiếng nhất Việt Nam và cũng là Top 10 DN uy tín nhất Việt Nam
• Top 38 DN có nơi làm việc tốt nhất Việt Nam

Gần 25 năm hoạt động, VinaSoy đã có những bước phát triển vượt bậc trong ngành hàng tiêu dùng nhanh, Vinasoy không ngừng xây dựng và gìn giữ môi trường làm việc hạnh phúc với sự chuyên nghiệp, sáng tạo trong một tập thể hơn 1.800 cán bộ công nhân viên cùng hợp tác và đồng lòng.

II. Tại sao nên làm việc cho Vinasoy ?

Chúng tôi luôn hiểu rằng con người là yếu tố quyết định đối với sự thành công và phát triển của doanh nghiệp. Vì vậy với mục tiêu xây dựng: Doanh nghiệp hành phúc Vinasoy luôn cam kết không ngừng hoàn thiện hướng đến sự quan tâm, chăm sóc toàn diện cho người lao động từ vật chất đến tinh thần, đảm bảo sự cân bằng trong công việc và cuộc sống để mỗi người lao động đều cảm nhận được Vinasoy là gia đình thứ hai của mình.

Gia nhập làm thành viên của gia đình Vinasoy, bạn sẽ được:
• Làm việc tại môi trường chuyên nghiệp được trang bị công nghệ hiện đại
• Hòa nhập văn hóa chia sẻ của Vinasoy, tạo nguồn cảm hứng làm việc và sáng tạo
• Tham gia các chương trình đào tạo phát triển kỹ năng chuyên môn, kỹ năng mềm
• Lương cạnh tranh và tùy thuộc theo vị trí công việc
• Thưởng các ngày Lễ lớn 30/4 - 1/5, 2/9, thưởng tháng lương 13
• Tham gia các chương trình tham quan học tập trong và ngoài nước, các hoạt động: Teambuilding
• Thăm hỏi, tặng quà vào các dịp sinh nhật, Lễ Tết
• Đảm bảo các chế độ BHXH, BHYT, BHTN, Bảo hiểm thân thể và các chế độ khác theo Luật Lao động

III. Các giải thưởng / danh hiệu Vinasoy đã đạt được:

Từ khi chuyển sang giai đoạn phát triển bền vững cho đến nay, Công ty sữa đậu nành Việt Nam –Vinasoy đã từng bước khẳng định uy tín chất lượng qua các sản phẩm đạt tiêu chuẩn và được người tiêu dùng tin tưởng. Tiêu biểu là các giải thưởng và bằng khen được trao tặng liên tiếp trong 5 năm qua như những dấu ấn vàng son khích lệ tập thể công ty càng phải nỗ lực hơn nữa để xứng đáng với lòng tin yêu của người tiêu dùng.

• FAMI – THƯƠNG HIỆU GIA ĐÌNH TIN DÙNG
• FAMI – TOP 10 SẢN PHẨM VÀNG VIỆT NAM
• TOP 100 NƠI LÀM VIỆC TỐT NHẤT VIỆT NAM
• GIẢI THƯỞNG "HÀNG VIỆT NAM CHẤT LƯỢNG CAO DO NGƯỜI TIÊU DÙNG BÌNH CHỌN"
• GIẢI THƯỞNG "SẢN PHẨM UY TÍN CHẤT LƯỢNG AN TOÀN VÌ SỨC KHỎE NGƯỜI TIÊU DÙNG"
• GIẢI THƯỞNG HÀNG VIỆT NAM CHẤT LƯỢNG CAO CHUẨN HỘI NHẬP 2017
• TOP 50 DOANH NGHIỆP VIỆT LÀ THƯƠNG HIỆU NHÀ TUYỂN DỤNG HẤP DẪN`,
    website: "https://vinasoycorp.vn/",
    field: "Sản xuất",
    imageUrl:
      "https://cdn-new.topcv.vn/unsafe/140x/https://static.topcv.vn/company_logos/55cdb8ef260ccf7110f83d007d631414-5fd3174105f21.jpg",
    sourceUrl:
      "https://www.topcv.vn/cong-ty/nha-may-sua-dau-nanh-vinasoy-bac-ninh-vnb/50430.html",
    source_name: "TOPCV",
    employees: "1800+",
    created_at: "2025-06-21T20:44:46.601Z",
    updated_at: "2025-06-22T06:35:32.617Z",
  };

  return mockCompany;
};

function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  // Load company details
  useEffect(() => {
    const loadCompanyDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const companyData = await fetchCompanyById(id);
        setCompany(companyData);
      } catch (err) {
        setError("Không thể tải thông tin công ty");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCompanyDetail();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Handle save company
  const handleSaveCompany = () => {
    setSaved(!saved);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: company?.company_name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Đã copy link vào clipboard!");
    }
  };

  // Parse description sections
  const parseDescription = (description) => {
    if (!description) return { sections: [], awards: [] };

    const sections = [];
    const awards = [];

    // Split by Roman numerals (I., II., III.)
    const parts = description.split(/(?=[IVX]+\.\s)/);

    parts.forEach((part) => {
      if (part.trim()) {
        const lines = part.trim().split("\n");
        const title = lines[0];
        const content = lines.slice(1).join("\n");

        if (title.includes("giải thưởng") || title.includes("danh hiệu")) {
          // Extract awards
          const awardLines = content
            .split("\n")
            .filter((line) => line.trim().startsWith("•"));
          awards.push(
            ...awardLines.map((line) => line.replace("•", "").trim())
          );
        } else {
          sections.push({ title, content });
        }
      }
    });

    return { sections, awards };
  };

  const { sections, awards } = company
    ? parseDescription(company.description)
    : { sections: [], awards: [] };

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

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Không tìm thấy công ty
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/companies"
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
                to="/companies"
                className="text-gray-600 hover:text-indigo-600"
              >
                Công ty
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
            {/* Company Header */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start">
                  {company.imageUrl && (
                    <img
                      src={company.imageUrl}
                      alt={company.company_name}
                      className="w-20 h-20 rounded-lg object-cover mr-4 border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                  )}
                  <div
                    className={`w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-4 ${
                      company.imageUrl ? "hidden" : "flex"
                    }`}
                  >
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                      {company.company_name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600">
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
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleSaveCompany}
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

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                )}

                <Link
                  to={`/jobs?company=${encodeURIComponent(
                    company.company_name
                  )}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Xem việc làm
                </Link>

                {company.sourceUrl && (
                  <a
                    href={company.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Nguồn gốc
                  </a>
                )}
              </div>
            </div>

            {/* Company Description Sections */}
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border p-6 mb-6"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h2>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
                    {section.content}
                  </pre>
                </div>
              </div>
            ))}

            {/* Awards Section */}
            {awards.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-500" />
                  Giải thưởng & Danh hiệu
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {awards.map((award, index) => (
                    <div
                      key={index}
                      className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                    >
                      <Award className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin liên hệ
              </h3>

              <div className="space-y-4">
                {company.address && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Địa chỉ</div>
                      <div className="font-medium text-gray-900">
                        {company.address}
                      </div>
                    </div>
                  </div>
                )}

                {company.email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <a
                        href={`mailto:${company.email}`}
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {company.email}
                      </a>
                    </div>
                  </div>
                )}

                {company.website && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-indigo-600 hover:text-indigo-800"
                      >
                        {company.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  </div>
                )}

                {company.field && (
                  <div className="flex items-center">
                    <Factory className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Lĩnh vực</div>
                      <div className="font-medium">{company.field}</div>
                    </div>
                  </div>
                )}

                {company.employees && (
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm text-gray-500">Quy mô</div>
                      <div className="font-medium">
                        {company.employees} nhân viên
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <div className="text-sm text-gray-500">Cập nhật</div>
                    <div className="font-medium">
                      {formatDate(company.updated_at)}
                    </div>
                  </div>
                </div>

                {company.source_name && (
                  <div className="pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      <Target className="w-3 h-3 mr-1" />
                      {company.source_name}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">
                Quan tâm đến công ty này?
              </h3>
              <p className="text-indigo-100 mb-4 text-sm">
                Xem các vị trí tuyển dụng hiện tại hoặc upload CV để nhận thông
                báo khi có cơ hội mới.
              </p>
              <div className="space-y-2">
                <Link
                  to={`/jobs?company=${encodeURIComponent(
                    company.company_name
                  )}`}
                  className="block w-full bg-white text-indigo-600 py-2 px-4 rounded-lg font-semibold text-center hover:bg-gray-50"
                >
                  Xem việc làm
                </Link>
                <Link
                  to="/upload-cv"
                  className="block w-full border border-white text-white py-2 px-4 rounded-lg font-semibold text-center hover:bg-white hover:text-indigo-600"
                >
                  Upload CV
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailPage;
