import React, { useState } from "react";
import { Button, Card, Row, Col, Statistic } from "antd";
import {
  Upload,
  Search,
  Users,
  BarChart3,
  Briefcase,
  TrendingUp,
  FileText,
  Target,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: "Upload CV",
      description: "Tải lên CV của bạn và để AI phân tích kỹ năng, kinh nghiệm",
      color: "from-blue-500 to-blue-600",
      action: "Tải CV ngay",
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Tìm việc làm",
      description:
        "Khám phá hàng nghìn cơ hội việc làm từ các công ty hàng đầu",
      color: "from-green-500 to-green-600",
      action: "Xem việc làm",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Gợi ý thông minh",
      description:
        "Nhận gợi ý việc làm phù hợp dựa trên AI và machine learning",
      color: "from-purple-500 to-purple-600",
      action: "Xem gợi ý",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Báo cáo thị trường",
      description: "Phân tích xu hướng tuyển dụng và mức lương theo ngành",
      color: "from-orange-500 to-orange-600",
      action: "Xem báo cáo",
    },
  ];

  const stats = [
    {
      title: "Việc làm IT",
      value: "15,000+",
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      title: "Ứng viên",
      value: "50,000+",
      icon: <Users className="w-6 h-6" />,
    },
    { title: "Công ty", value: "2,500+", icon: <Award className="w-6 h-6" /> },
    { title: "Tỷ lệ match", value: "95%", icon: <Star className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              Job Portal AI
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Nền tảng tuyển dụng thông minh sử dụng AI để kết nối ứng viên và
              nhà tuyển dụng
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                className="bg-blue-600 hover:bg-blue-700 border-none h-12 px-8 text-lg font-semibold"
                icon={<Upload className="w-5 h-5" />}
                onClick={() => navigate('upload')}
              >
                Tải CV lên ngay
              </Button>
              <Button
                size="large"
                className="border-2 border-blue-300 text-blue-100 hover:bg-blue-800 hover:border-blue-200 h-12 px-8 text-lg font-semibold"
                icon={<Search className="w-5 h-5" />}
              >
                Tìm việc làm
              </Button>
            </div>
          </div>

          {/* Stats */}
          <Row gutter={[24, 24]} className="mt-16">
            {stats.map((stat, index) => (
              <Col xs={12} lg={6} key={index}>
                <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                  <div className="text-blue-200 mb-2 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-blue-200 text-sm">{stat.title}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá các tính năng mạnh mẽ giúp bạn tìm được công việc mơ ước
            </p>
          </div>

          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} md={12} lg={6} key={index}>
                <Card
                  className="h-full hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group cursor-pointer"
                  styles={{ body: { padding: 0 } }}
                >
                  <div
                    className={`bg-gradient-to-br ${feature.color} p-6 text-white`}
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <Button
                      type="text"
                      className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold group-hover:translate-x-1 transition-transform duration-300"
                      icon={<ArrowRight className="w-4 h-4 ml-1" />}
                      iconPosition="end"
                    >
                      {feature.action}
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
