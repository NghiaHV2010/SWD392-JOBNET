import React, { useState } from "react";
import { Tabs, Button, Pagination } from "antd";
import SuggestionItem from "./SuggestionItem";

function SuggestionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const jobList = Array.from({ length: 30 }, (_, i) => ({
    position: `Software Developer ${i + 1}`,
    company: `Company ${i + 1}`,
    city: ["Ho Chi Minh City", "Hanoi", "Da Nang"][i % 3],
    salary: `$${2000 + i * 50} - $${3000 + i * 50}`,
    time: ["Full-time", "Remote", "Hybrid"][i % 3],
    postedDay: `${i + 1} day${i + 1 > 1 ? "s" : ""} ago`,
  }));

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedJobs = jobList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const tabItems = [
    {
      key: "jobs",
      label: <span className="text-blue-600 font-medium">Suggested Jobs</span>,
      children: (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mt-2">
            Jobs Recommended for You
          </h2>
          {/* <div className="space-y-4 mt-4">
            {paginatedJobs.map((job, index) => (
              <SuggestionItem key={index} {...job} />
            ))}
          </div> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {paginatedJobs.map((job, index) => (
              <SuggestionItem key={index} {...job} />
            ))}
          </div>
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
              total={jobList.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const fakeSuggestions = Array.from({ length: 40 }, (_, i) => ({
  id: i + 1,
  title: `Suggestion Title ${i + 1}`,
  description: `This is a short description for suggestion item ${
    i + 1
  }. It helps explain what this suggestion is about.`,
}));

// const SuggestionPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 12;

//   // ✅ DỮ LIỆU GIẢ
//   const suggestions = Array.from({ length: 40 }, (_, i) => ({
//     id: i + 1,
//     title: `Suggestion Title ${i + 1}`,
//     description: `This is a short description for suggestion item ${i + 1}.`,
//   }));

//   const paginatedData = suggestions.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize
//   );

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {paginatedData.map((item) => (
//           <SuggestionItem key={item.id} data={item} />
//         ))}
//       </div>

//       <div className="flex justify-center mt-8">
//         <Pagination
//           current={currentPage}
//           pageSize={pageSize}
//           total={suggestions.length}
//           onChange={handlePageChange}
//           showSizeChanger={false}
//         />
//       </div>
//     </div>
//   );
// };

export default SuggestionPage;
