import React from "react";
import { FaSearch } from "react-icons/fa";

interface ResponseActionsProps {
  handleNext?: () => void;
  handlePrev?: () => void;
  totalSurveys?: number;
  curerentSurvey?: number;
}

const ResponseActions: React.FC<ResponseActionsProps> = ({
  totalSurveys,
  curerentSurvey,
  handleNext,
  handlePrev,
}) => {
  return (
    <div className="flex flex-col justify-between items-center gap-4 rounded-lg p-4 bg-white">
      {/* Left Section: Navigation and Status */}
      <div className="lg:flex items-center justify-between w-full">
        <div className="text-gray-500">
          <button
            className="mr-3 text-gray-500 hover:text-gray-700"
            onClick={handlePrev}
          >
            &lt;
          </button>
          <span className="font-semibold">Response</span>{" "}
          <span>{curerentSurvey}</span> / <span>{totalSurveys}</span>
          <button
            className="ml-3 text-gray-500 hover:text-gray-700"
            onClick={handleNext}
          >
            &gt;
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between space-x-4">
          <button className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-50">
            Add filter
          </button>

          <select className="border border-gray-300 text-gray-700 rounded-md px-4 py-2 focus:outline-none">
            <option>Select respondent</option>
            {/* Add options for respondents here */}
          </select>

          <button className="text-gray-500 hover:text-gray-700">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Right Section: Filters and Actions */}
      <div className="lg:flex items-center justify-between w-full space-x-4">
        {/* Valid and Invalid Count */}
        <div className="flex space-x-4 bg-gray-100 p-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
            <span className="text-gray-600">Valid</span>
            <span className="bg-gray-200 text-gray-700 px-2 rounded-full">
              30
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="h-3 w-3 rounded-full bg-red-500"></span>
            <span className="text-gray-600">Invalid</span>
            <span className="bg-gray-200 text-gray-700 px-2 rounded-full">
              2
            </span>
          </div>
        </div>

        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
          Delete response
        </button>
      </div>
    </div>
  );
};

export default ResponseActions;
