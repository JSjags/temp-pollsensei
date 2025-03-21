import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaUsers, FaUserCheck, FaPoll, FaEye } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const OverviewCards: React.FC<OverviewProps> = ({
  items,
  isLoading,
  selected,
  setSelected,
}) => {
  const router = useRouter();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-2 sm:p-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Dashboard Overview
        </h2>
        <div className="w-full sm:w-[200px]">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger>
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="1 week">Past Week</SelectItem>
              <SelectItem value="2 weeks">Past 2 Weeks</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3 }}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Total Users
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaUsers className="text-2xl text-purple-700" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#9D50BB" height={15} />
              ) : (
                items?.users_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-purple-600 font-medium">Total Active</span>
              <span className="bg-purple-200 text-purple-800 px-2 py-1 rounded-full text-xs">
                ↗ Growing
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Paid Users
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaUserCheck className="text-2xl text-indigo-600" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#4F46E5" height={15} />
              ) : (
                items?.paid_users_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-indigo-600 font-medium">Premium Users</span>
              <span className="bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full text-xs">
                ↗ Active
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          onClick={() => router.push("/super-admin-survey")}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Surveys Created
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaPoll className="text-2xl text-green-600" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#059669" height={15} />
              ) : (
                items?.surveys_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-green-600 font-medium">Total Surveys</span>
              <span className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-1">
                View Details
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-col justify-between p-6 rounded-xl shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-700">
              Total Visits
            </h3>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md">
              <FaEye className="text-2xl text-blue-600" />
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLoading ? (
                <ScaleLoader color="#2563EB" height={15} />
              ) : (
                items?.total_visit_count
              )}
            </h2>
            <div className="flex justify-between items-center mt-3 text-sm">
              <span className="text-blue-600 font-medium">Page Views</span>
              <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs">
                ↗ Trending
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OverviewCards;
