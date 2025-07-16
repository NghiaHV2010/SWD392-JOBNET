import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { sampleJobsData } from "../../constants/sampleData";
import { getJobById } from "../../apis/JobServices";
import {
  Card,
  Tag,
  Button,
  Row,
  Col,
  Divider,
  Spin,
  Avatar,
  Progress,
} from "antd";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  User,
  GraduationCap,
  Clock,
  Users,
  Briefcase,
  Star,
  Heart,
  Share2,
  Send,
} from "lucide-react";

export const JobDetailPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [job, setJob] = useState({});
  const navigate = useNavigate();

  const { id } = useParams(); // Lấy id từ URL

  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const res = await getJobById(id);
        if (res?.jobDto) {
          setJob(res.jobDto);
        } else {
          throw new Error("No jobDto returned from API");
        }
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết job:", err);
        // fallback từ sampleJobsData
        const fallbackJob = sampleJobsData.jobDtos.find((j) => j.id === id);
        if (fallbackJob) {
          setJob(fallbackJob);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const InfoItem = ({ icon, label, value, color = "text-gray-600" }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`text-blue-600`}>{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className={`font-semibold ${color}`}>{value}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Button
            type="text"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate("/user/suggestion")}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            Back to Suggestions
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Main Content */}
            <Col xs={24} lg={16}>
              {/* Job Header Card */}
              <Card className="mb-6 border-l-4 border-l-blue-500">
                <div className="flex items-start gap-4 mb-6">
                  {/* <Avatar
                  src={job.company?.logo}
                  size={80}
                  className="flex-shrink-0"
                /> */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2"></div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {job?.title}
                    </h1>
                    <div className="flex flex-wrap gap-4 mb-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job?.applyLocation}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-green-600">
                          {job?.salary}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{job?.formOfWork}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>
                          {job?.quantity} position{job?.quantity > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="primary"
                        size="large"
                        icon={<Send className="w-4 h-4" />}
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => onApply(job?.id)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Job Description */}
              <Card title="Job Description" className="mb-6">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {job?.description}
                  </div>
                </div>
              </Card>

              <Card title="Required Skills" className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {job?.tags
                    ?.split(",") // chuyển từ string thành array
                    .map((tag, index) => (
                      <Tag
                        key={index}
                        color="blue"
                        className="px-4 py-2 text-sm font-medium"
                      >
                        {tag.trim()} {/* loại bỏ khoảng trắng thừa */}
                      </Tag>
                    ))}
                </div>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col xs={24} lg={8}>
              {/* Job Information */}
              <Card title="Job Information" className="mb-6">
                <div className="space-y-4">
                  <InfoItem
                    icon={<Calendar className="w-5 h-5" />}
                    label="Application Deadline"
                    value={new Date(job?.endDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    color="text-red-600"
                  />
                  <InfoItem
                    icon={<Briefcase className="w-5 h-5" />}
                    label="Experience Level"
                    value={job?.experience}
                  />
                  <InfoItem
                    icon={<User className="w-5 h-5" />}
                    label="Job Level"
                    value={job?.jobLevel}
                  />
                  <InfoItem
                    icon={<GraduationCap className="w-5 h-5" />}
                    label="Education"
                    value={job?.education}
                  />
                  <InfoItem
                    icon={<Clock className="w-5 h-5" />}
                    label="Work Type"
                    value={job?.formOfWork}
                  />
                  <InfoItem
                    icon={<Users className="w-5 h-5" />}
                    label="Positions Available"
                    value={`${job?.quantity} position${
                      job?.quantity > 1 ? "s" : ""
                    }`}
                    color="text-blue-600"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default JobDetailPage;
