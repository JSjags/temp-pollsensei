import React, { useState } from "react";
import { FaDownload, FaExpand, FaPrint } from "react-icons/fa6";
import ResponseActions from "./ResponseAction";

interface ResponseHeaderProps {
  data: any;
  tabs: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  curerentSurvey: number;
  valid_response?: number;
  invalid_response?: number;
  handleNext?: () => void;
  handlePrev?: () => void;
  deleteAResponse?: () => void;
  respondent_data?:any[];
}

const ResponseHeader: React.FC<ResponseHeaderProps> = ({
  data,
  tabs,
  activeTab,
  setActiveTab,
  curerentSurvey,
  handleNext,
  handlePrev,
  respondent_data,
  valid_response,
  invalid_response,
  deleteAResponse
}) => {
  console.log(curerentSurvey)
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div className="lg:flex items-center space-x-2">
          {/* Avatars */}
          <div className="flex -space-x-2">
            <img
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="user1"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold border-2 border-white">
              AD
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold border-2 border-white">
              MJ
            </div>
          </div>
          <span className="text-gray-700 font-semibold">
            Number of Responses:{" "}
            <span className="font-bold">{data?.response_count}</span>
          </span>
        </div>

        {/* Icons */}

        <div className="flex space-x-3">
          {/* <button className="text-gray-500 hover:text-gray-700">
            <FaPrint size={25} />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <FaDownload size={25} />
          </button> */}
          {/* <button className="text-gray-500 hover:text-gray-700">
            <FaExpand size={25} />
          </button> */}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center border-b border-gray-300 overflow-x-auto">
        {tabs.map((tab: any) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 transition-colors duration-200 ${
              activeTab === tab
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Individual Responses" && (
        <ResponseActions
          curerentSurvey={curerentSurvey}
          totalSurveys={data?.response_count}
          handleNext={handleNext}
          handlePrev={handlePrev}
          respondent_data={respondent_data}
          valid_response={valid_response}
          invalid_response={invalid_response}
          deleteAResponse={deleteAResponse}
        />
      )}

      {activeTab === "Summary" && (
        <div className="mt-4">
          {/* <button className="bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-50">
            Add filter
          </button> */}
        </div>
      )}
    </div>
  );
};

export default ResponseHeader;
