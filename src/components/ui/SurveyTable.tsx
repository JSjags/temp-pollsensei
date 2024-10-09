import { formatDate } from "@/lib/helpers";
import { useSurveyLeaderboardQuery } from "@/services/dashboard.service";
import React from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

const SurveyTable: React.FC = () => {
  const { data, isLoading } = useSurveyLeaderboardQuery(null);
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
        {
          isLoading? (
            <tr>
              <td colSpan={5} className="py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : ( data?.data?.map((items:any)=>(
          <tr className="bg-white border-b text-[calc(1rem-2px)] hover:bg-gray-50" key={items?._id}>
            <td className="px-6 py-4 font-medium whitespace-nowrap">
              <input
                type="checkbox"
                name="row-checkbox"
                id="row-checkbox"
                className="mr-4"
              />
             {items?.topic.length > 25 ? `${items?.topic.slice(0, 35)}...` : items?.topic}
            </td>
            <td className="px-6 py-4">{formatDate(items?.createdAt)}</td>
            <td className="px-6 text-center py-4">{items?.number_of_responses}</td>
            <td className="px-6 py-4">{items?.status}</td>
            <td className="px-6 py-4 text-right">
              <PiDotsThreeOutlineVerticalFill />
            </td>
          </tr>

          ))
          )}
        </tbody>

      </table>
    </div>
  );
};

export default SurveyTable;
