import React from "react";
import { Tabs, Button } from "antd";
import { SuggestionItem } from "./SuggestionItem";

function SuggestionPage() {
  const jobList = [
    {
      position: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      city: "Ho Chi Minh City",
      salary: "$2,000 - $3,500",
      time: "Full-time",
      postedDay: "2 days ago",
    },
    {
      position: "Backend Engineer",
      company: "FinPay Vietnam",
      city: "Hanoi",
      salary: "$1,800 - $2,800",
      time: "Remote",
      postedDay: "1 day ago",
    },
    {
      position: "Fullstack Developer",
      company: "DevHouse",
      city: "Da Nang",
      salary: "$2,500 - $3,000",
      time: "Hybrid",
      postedDay: "3 days ago",
    },
  ];

  const tabItems = [
    {
      key: "jobs",
      label: <span className="text-blue-600 font-medium">Suggested Jobs</span>,
      children: (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mt-2">
            Jobs Recommended for You
          </h2>
          <div className="space-y-4 mt-4">
            {jobList.map((job, index) => (
              <SuggestionItem key={index} {...job} />
            ))}
          </div>
        </>
      ),
    },
    // {
    //   key: "candidates",
    //   label: <span className="text-gray-500">Suggested Candidates</span>,
    //   children: null,
    // },
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
        </div>
      </div>
    </div>
  );
}

export default SuggestionPage;
