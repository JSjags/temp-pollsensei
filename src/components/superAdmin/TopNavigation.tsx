import { PanelLeft } from "lucide-react";
import React from "react";
import { FiStar, FiSun, FiRefreshCw, FiBell } from "react-icons/fi";
import { HiOutlineViewList } from "react-icons/hi";

interface TopNavigationProps{
  onClick:()=>void;
}
const TopNavigation: React.FC<TopNavigationProps> = ({
  onClick
}) => {
  return (
    <div className="flex justify-between items-center bg-white px-4 py-2 shadow-sm rounded-lg">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <PanelLeft size={18}  className="text-xs text-gray-800" onClick={onClick} />
        <FiStar className="text-lg text-gray-800" />
        <div className="flex items-center text-sm text-gray-500">
          <span>Dashboards</span>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-gray-800 font-medium">Overview</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="hidden md:flex items-center bg-gray-100 text-gray-500 px-3 py-1.5 rounded-lg">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm outline-none placeholder:text-gray-500 w-full"
          />
          <span className="text-xs text-gray-400 ml-2">⌘K</span>
        </div>

        {/* Icons */}
        <FiSun className="text-lg text-gray-800 cursor-pointer" />
        <FiRefreshCw className="text-lg text-gray-800 cursor-pointer" />
        <FiBell className="text-lg text-gray-800 cursor-pointer" />
      </div>
    </div>
  );
};

export default TopNavigation;
