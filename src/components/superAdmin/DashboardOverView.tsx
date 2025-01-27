import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaUsers, FaUserCheck, FaPoll, FaEye } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";

interface OverviewProps {
  items: {
    free_users_count?: number | string;
    organizations_count?: number | string;
    paid_users_count?: number | string;
    surveys_count?: number | string;
    total_visit_count?: number | string;
    users_count?: number | string;
  };
  isLoading: boolean;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const OverviewCards: React.FC<OverviewProps> = ({ items, isLoading, selected, setSelected }) => {
  const router = useRouter();

  console.log(selected);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <div className="text-gray-600 cursor-pointer">
          <select
            name="timeframe"
            id="timeframe"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="text-xs"
          >
            <option value="" selected disabled className="text-gray-400">
              Select an option
            </option>
            <option value="today">Today</option>
            <option value="1 week">1 Week</option>
            <option value="2 weeks">2 Weeks</option>
            <option value="month">1 Month</option>
            <option value="year">12 Months</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`flex flex-col justify-between p-4 rounded-lg shadow-sm bg-purple-50`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaUsers className="text-xl text-purple-700" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#9D50BB" height={10} />
              ) : (
                items?.users_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>--</span>
              <span>↗</span>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col justify-between p-4 rounded-lg shadow-sm bg-purple-100`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Paid Users</h3>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaUserCheck className="text-xl text-purple-500" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#9D50BB" height={10} />
              ) : (
                items?.paid_users_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>--</span>
              <span>↗</span>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-col justify-between p-4 rounded-lg shadow-sm cursor-pointer bg-green-50`}
          onClick={() => router.push("/super-admin-survey")}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">
              Surveys Created
            </h3>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaPoll className="text-xl text-green-500" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#9D50BB" height={10} />
              ) : (
                items?.surveys_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>--</span>
              <span>↗</span>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col justify-between p-4 rounded-lg shadow-sm bg-blue-50`}
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-600">Total Visits</h3>
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaEye className="text-xl text-blue-500" />
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#9D50BB" height={10} />
              ) : (
                items?.total_visit_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>--</span>
              <span>↗</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewCards;
