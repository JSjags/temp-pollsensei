import React from "react";
import { FaUsers, FaUserCheck, FaPoll, FaEye } from "react-icons/fa";

const OverviewCards: React.FC = () => {
  const cards = [
    {
      title: "Total Users",
      count: 0,
      icon: <FaUsers className="text-xl text-purple-700" />,
      bgColor: "bg-purple-50",
    },
    {
      title: "Paid Users",
      count: 0,
      icon: <FaUserCheck className="text-xl text-purple-500" />,
      bgColor: "bg-purple-100",
    },
    {
      title: "Surveys Created",
      count: 0,
      icon: <FaPoll className="text-xl text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Total Visits",
      count: 0,
      icon: <FaEye className="text-xl text-blue-500" />,
      bgColor: "bg-blue-50",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Overview</h2>
        <div className="text-gray-600 cursor-pointer">Today ▼</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`flex flex-col justify-between p-4 rounded-lg shadow-sm ${card.bgColor}`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md">
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-800">{card.count}</h2>
              <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>--</span>
                <span>↗</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewCards;
