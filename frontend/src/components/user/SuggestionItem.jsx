import React from "react";
import { Button, Tag } from "antd";

// export const SuggestionItem = ({
//   position,
//   company,
//   city,
//   salary,
//   time,
//   postedDay,
// }) => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-5 flex flex-col md:flex-row justify-between items-start md:items-center border hover:shadow-lg transition">
//       {/* Left Content */}
//       <div className="flex items-start gap-4">
//         <img
//           src="/"
//           alt="Company Logo"
//           className="w-14 h-14 rounded-full object-cover"
//         />
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900 flex">
//             {position}
//           </h2>
//           <p className="text-gray-500 mb-2 flex">{company}</p>
//           <div className="flex flex-wrap text-sm text-gray-500 gap-4 mb-2">
//             <span className="flex items-center gap-1">{city}</span>
//             <span className="flex items-center gap-1">{salary}</span>
//             <span className="flex items-center gap-1">{time}</span>
//             <span className="flex items-center gap-1">{postedDay}</span>
//           </div>
//           <p className="text-gray-700 mb-3">
//             Join our dynamic team to build cutting-edge web applications using
//             modern technologies.
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {["React", "TypeScript", "Node.js", "AWS"].map((tag) => (
//               <Tag key={tag} color="blue">
//                 {tag}
//               </Tag>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Right Content */}
//       <div className="flex flex-col items-end mt-4 md:mt-0 gap-2">
//         <span className="text-green-500 font-medium">95% Match</span>
//         <Button type="primary" className="w-full md:w-auto">
//           Apply now
//         </Button>
//         <button className="text-gray-500 hover:text-blue-500 text-sm mt-1">
//           Save Job
//         </button>
//       </div>
//     </div>
//   );
// };

// const SuggestionItem = ({ data }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition duration-300">
//       <h3 className="font-bold text-lg mb-2">{data.title}</h3>
//       <p className="text-gray-600">{data.description}</p>
//     </div>
//   );
// };


const SuggestionItem = ({ position, company, salary, city }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Logo công ty */}
      <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">        
        <span className="text-gray-400 font-semibold text-sm">LOGO</span>
      </div>

      {/* Nội dung */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
          {position}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{company}</p>
        <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
          <span className="bg-gray-100 px-2 py-0.5 rounded">{salary}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded">{city}</span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionItem;
