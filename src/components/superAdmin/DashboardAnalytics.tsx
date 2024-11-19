import React from "react";
import { SuperAdminPieChart } from "../charts/SuperAdminPieChart";
import { ChartConfig } from "../ui/chart";

const DashboardAnalytics: React.FC = () => {
  const desktopData = [
    { plan: "free", subscriber: 186, fill: "#5B03B2" },
    { plan: "pro", subscriber: 305, fill: "#E9D7FB" },
    { plan: "team", subscriber: 237, fill: "#9B51E0" },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "Desktop",
    },
    mobile: {
      label: "Mobile",
    },
    free: {
      label: "Free",
      color: "#5B03B2",
    },
    pro: {
      label: "Pro",
      color: "#E9D7FB",
    },
    team: {
      label: "Team",
      color: "#9B51E0",
    },
  } satisfies ChartConfig;
  const bottomLegend = ["Free", "Pro", "Premium"];
  const surveyType = ["Quantitative", "Qualitative", "Mixed"];
  const createdBy = ["AI-Generated", "Manual", "Mixed"];
  return (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SuperAdminPieChart
          desktopData={desktopData}
          chartConfig={chartConfig}
          bottomLegend={bottomLegend}
          title="User Subscription Distribution"
        />
        <SuperAdminPieChart
          desktopData={desktopData}
          chartConfig={chartConfig}
          bottomLegend={createdBy}
          title="Creation Method Distribution"
        />
        <SuperAdminPieChart
          desktopData={desktopData}
          chartConfig={chartConfig}
          bottomLegend={surveyType}
          title="Survey Type Distribution"
        />
      </div>

      {/* Line Chart */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-6">
            {["Total Users", "New Users", "Operating Status"].map(
              (tab, idx) => (
                <span
                  key={idx}
                  className={`text-sm font-medium ${
                    idx === 0
                      ? "text-gray-800 border-b-2 border-purple-600"
                      : "text-gray-600"
                  } cursor-pointer`}
                >
                  {tab}
                </span>
              )
            )}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="text-gray-800">Premium plan</span>
            <span className="text-purple-500">Pro plan</span>
            <span className="text-blue-400">Free plan</span>
          </div>
        </div>
        <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
          {/* Placeholder for chart */}
          <span className="text-sm text-gray-500">Line chart goes here</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
