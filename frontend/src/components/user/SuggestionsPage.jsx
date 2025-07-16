import React, { useState, useEffect } from "react";
import { Tabs, Button, Spin, Pagination, Empty } from "antd";
import { getAllJobs } from "../../apis/JobServices";
import { sampleJobsData } from "../../constants/sampleData";
import SuggestionItem from "./SuggestionItem";

function SuggestionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [jobList, setJobList] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = async (page) => {
    setIsLoading(true);
    try {
      const res = await getAllJobs(page);
      const jobData = res?.jobDtos?.length
        ? res.jobDtos
        : sampleJobsData.jobDtos;
      setJobList(jobData);
      setTotalJobs(jobData.length);
    } catch (error) {
      console.error("Lỗi khi fetch jobs:", error);
      const fallbackData = sampleJobsData.jobDtos;
      setJobList(fallbackData);
      setTotalJobs(fallbackData.length);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const tabItems = [
    {
      key: "jobs",
      label: <span className="text-blue-600 font-medium">Suggested Jobs</span>,
      children: (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mt-2">
            Jobs Recommended for You
          </h2>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Spin />
            </div>
          ) : jobList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {jobList.map((job, index) => (
                <SuggestionItem key={job.id || index} {...job} />
              ))}
            </div>
          ) : (
            <Empty description="Không có công việc nào" className="mt-8" />
          )}
        </>
      ),
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1 flex">
            Smart Suggestions
          </h1>
          <p className="text-gray-600 mb-6 flex">
            AI-powered recommendations tailored to your profile and preferences
          </p>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <Tabs defaultActiveKey="jobs" items={tabItems} />
            {/* <div className="flex justify-end mt-4">
              <Button type="primary">Refine Suggestions</Button>
            </div> */}
          </div>

          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalJobs}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuggestionPage;
