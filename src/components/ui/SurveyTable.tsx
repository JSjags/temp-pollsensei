import React from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

const SurveyTable: React.FC = () => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right">
        <thead className="text-[1rem] text-[#7A8699] uppercase bg-gray-50 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3 flex items-center">
              <input
                type="checkbox"
                name="header-checkbox"
                id="header-checkbox"
                className="mr-4"
              />
              Survey Name
            </th>
            <th scope="col" className="px-6 py-3">
              Date Created
            </th>
            <th scope="col" className="px-6 py-3">
              Number of Responses
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white border-b text-[calc(1rem-2px)] hover:bg-gray-50">
            <td className="px-6 py-4 font-medium whitespace-nowrap">
              <input
                type="checkbox"
                name="row-checkbox"
                id="row-checkbox"
                className="mr-4"
              />
              Apple MacBook Pro 17
            </td>
            <td className="px-6 py-4">Silver</td>
            <td className="px-6 py-4">Laptop</td>
            <td className="px-6 py-4">$2999</td>
            <td className="px-6 py-4 text-right">
              <PiDotsThreeOutlineVerticalFill />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SurveyTable;
