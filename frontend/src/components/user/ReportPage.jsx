import { Tabs, Card, Row, Col, Table, Progress } from "antd";
import { TrendingUp, Code, DollarSign, Brain } from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const itJobPredictionData = [
  {
    month: "Sep 2024",
    frontend: 400,
    backend: 300,
    fullstack: 200,
    mobile: 150,
    devops: 180,
    ai: 220,
    growth: 12.5,
  },
  {
    month: "Oct 2024",
    frontend: 450,
    backend: 350,
    fullstack: 230,
    mobile: 160,
    devops: 200,
    ai: 300,
    growth: 18,
  },
  {
    month: "Nov 2024",
    frontend: 460,
    backend: 340,
    fullstack: 210,
    mobile: 170,
    devops: 190,
    ai: 310,
    growth: 11,
  },
  {
    month: "Dec 2024",
    frontend: 500,
    backend: 400,
    fullstack: 250,
    mobile: 190,
    devops: 220,
    ai: 330,
    growth: 13.5,
  },
];

function StatCard({ icon, title, value, subtitle, color }) {
  return (
    <Card className="h-full shadow-sm">
      <div className="flex space-x-4 items-center">
        <div className={`p-2 rounded-xl`} style={{ backgroundColor: color }}>
          <div className="text-white">{icon}</div>
        </div>
        <div>
          <div className="text-gray-500 text-sm">{title}</div>
          <div className="text-xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
      </div>
    </Card>
  );
}

const itSkillsData = [
  { name: "React", jobs: 1240, salary: 3200, demand: 95 },
  { name: "Python", jobs: 980, salary: 3600, demand: 88 },
  { name: "Node.js", jobs: 890, salary: 3400, demand: 82 },
  { name: "AWS", jobs: 720, salary: 3800, demand: 78 },
  { name: "TypeScript", jobs: 680, salary: 3300, demand: 75 },
];

const itPositionsData = [
  { position: "React Developer", jobs: 1240, salary: "$3,200" },
  { position: "Python Developer", jobs: 980, salary: "$3,600" },
  { position: "Node.js Engineer", jobs: 890, salary: "$3,400" },
];

const columns = [
  { title: "Position", dataIndex: "position", key: "position" },
  { title: "Jobs", dataIndex: "jobs", key: "jobs" },
  { title: "Avg Salary", dataIndex: "salary", key: "salary" },
];

function ReportPage() {
  return (
    <div className="p-4">
      <Tabs
        defaultActiveKey="prediction"
        items={[
          {
            key: "prediction",
            label: "IT Job Demand Prediction",
            children: (
              <>
                {/* Stat Cards */}
                <Row gutter={[24, 24]} className="mb-8">
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon={<TrendingUp className="w-6 h-6" />}
                      title="Predicted Growth"
                      value="+13.5%"
                      subtitle="Next 4 months"
                      color="#3B82F6"
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon={<Code className="w-6 h-6" />}
                      title="Total IT Jobs"
                      value="9,060"
                      subtitle="Predicted by Dec 2024"
                      color="#10B981"
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon={<Brain className="w-6 h-6" />}
                      title="AI/ML Positions"
                      value="960"
                      subtitle="Fastest growing"
                      color="#8B5CF6"
                    />
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <StatCard
                      icon={<DollarSign className="w-6 h-6" />}
                      title="Avg IT Salary"
                      value="$3,400"
                      subtitle="Expected increase"
                      color="#F59E0B"
                    />
                  </Col>
                </Row>

                {/* Chart + Skills */}
                <Row gutter={[24, 24]} className="mb-8">
                  <Col xs={24} lg={16}>
                    <Card title="IT Job Demand Forecast (Sep - Dec 2024)">
                      <ResponsiveContainer width="100%" height={400}>
                        <ComposedChart data={itJobPredictionData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Bar
                            yAxisId="left"
                            dataKey="frontend"
                            stackId="a"
                            fill="#3B82F6"
                            name="Frontend"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="backend"
                            stackId="a"
                            fill="#10B981"
                            name="Backend"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="fullstack"
                            stackId="a"
                            fill="#F59E0B"
                            name="Full Stack"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="mobile"
                            stackId="a"
                            fill="#EF4444"
                            name="Mobile"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="devops"
                            stackId="a"
                            fill="#8B5CF6"
                            name="DevOps"
                          />
                          <Bar
                            yAxisId="left"
                            dataKey="ai"
                            stackId="a"
                            fill="#06B6D4"
                            name="AI/ML"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="growth"
                            stroke="#F97316"
                            strokeWidth={3}
                            name="Growth Rate %"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </Card>
                  </Col>

                  <Col xs={24} lg={8}>
                    <Card title="Top IT Skills Demand">
                      <div className="space-y-4">
                        {itSkillsData.map((skill, idx) => (
                          <div
                            key={skill.name}
                            className="p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between mb-2">
                              <span className="font-semibold">
                                {skill.name}
                              </span>
                              <span className="text-green-600 font-bold">
                                ${skill.salary.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-600">
                                {skill.jobs} jobs
                              </span>
                              <span className="text-sm text-blue-600">
                                {skill.demand}% demand
                              </span>
                            </div>
                            <Progress
                              percent={skill.demand}
                              showInfo={false}
                              strokeColor="#3B82F6"
                              size="small"
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Col>
                </Row>

                {/* Table */}
                <Card title="Detailed IT Positions Analysis">
                  <Table
                    dataSource={itPositionsData}
                    columns={columns}
                    rowKey="position"
                    pagination={{ pageSize: 5 }}
                  />
                </Card>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

export default ReportPage;
