import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag } from "antd";

const SuggestionItem = ({ jobLevel, title, applyLocation, salary, id }) => {
  const navigate = useNavigate();

  const handleClickJob = () => {
    navigate(`job/${id}`);
  };

  return (
    <div
      onClick={handleClickJob}
      className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-4 shadow-sm hover:shadow-md transition-all duration-300"
    >
      {/* Logo công ty */}
      {/* <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 font-semibold text-sm">LOGO</span>
      </div> */}

      {/* Nội dung */}
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{jobLevel}</p>
        <div className="flex items-center text-sm text-gray-600 mt-2 gap-4">
          <span className="bg-gray-100 px-2 py-0.5 rounded">{salary}</span>
          <span className="bg-gray-100 px-2 py-0.5 rounded">
            {applyLocation}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SuggestionItem;
