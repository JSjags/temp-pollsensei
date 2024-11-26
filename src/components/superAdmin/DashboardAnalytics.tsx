import React, { useState } from "react";
import { SuperAdminPieChart } from "../charts/SuperAdminPieChart";
import { ChartConfig } from "../ui/chart";
import { useSurveyCreationDistributionQuery, useSurveyTypeDistributionQuery } from "@/services/superadmin.service";
import OverlappingCircles from "../charts/OverlappingCircle";

const DashboardAnalytics: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("October");
  // const 
  const {data,  isLoading, isSuccess, error} = useSurveyCreationDistributionQuery({
    month: selectedMonth,
    year: '2024',
  })
  const {data:surveyTypeDistribution,  isLoading:typeLoading, isSuccess:typeSuccess, error:typeError} = useSurveyTypeDistributionQuery({
    month: 'October',
    year: '2024',
  })
  console.log(data)
  console.log(surveyTypeDistribution)
console.log( surveyTypeDistribution?.data?.quantitative_percentage)
const desktopData = [
  {
    month: "Quantitative",
    value: surveyTypeDistribution?.data?.quantitative_percentage ?? 0,
    fill: "#5B03B2",
  },
  {
    month: "Qualitative",
    value: surveyTypeDistribution?.data?.qualitative_percentage ?? 0,
    fill: "#E9D7FB",
  },
  {
    month: "Both",
    value: surveyTypeDistribution?.data?.both_percentage ?? 0,
    fill: "#9B51E0",
  },
];

const chartConfigForSurveyType = {
  Quantitative: {
    label: "Quantitative",
    color: "#5B03B2",
  },
  Qualitative: {
    label: "Qualitative",
    color: "#E9D7FB",
  },
  Both: {
    label: "Both",
    color: "#9B51E0",
  },
} satisfies ChartConfig;
  
  const chartConfig = {
    January: {
      label: "January",
      color: "#5B03B2",
    },
    February: {
      label: "February",
      color: "#E9D7FB",
    },
    March: {
      label: "March",
      color: "#9B51E0",
    },
    April: {
      label: "April",
      color: "#FFC300",
    },
    May: {
      label: "May",
      color: "#FF5733",
    },
    June: {
      label: "June",
      color: "#33FF57",
    },
    July: {
      label: "July",
      color: "#5733FF",
    },
    August: {
      label: "August",
      color: "#FF33A6",
    },
    September: {
      label: "September",
      color: "#33FFF9",
    },
    October: {
      label: "October",
      color: "#F9FF33",
    },
    November: {
      label: "November",
      color: "#FF5733",
    },
    December: {
      label: "December",
      color: "#C70039",
    },
  } satisfies ChartConfig;
  

  const circleData = [
    { value: 50, color: "#5A2D82", size: 150 }, // Purple circle
    { value: 30, color: "#A24DDC", size: 120 }, // Light purple circle
    // { value: 20, color: "#4C63E8", size: 80 },  // Blue circle
  ]; 

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
        <OverlappingCircles
          desktopData={desktopData}
          chartConfig={chartConfig}
          bottomLegend={createdBy}
          title="Creation Method Distribution"
          circles={circleData}
        />
       
        <SuperAdminPieChart
          desktopData={desktopData}
          chartConfig={chartConfigForSurveyType}
          bottomLegend={surveyType}
          title="Survey Type Distribution"
        />
           {/* <SuperAdminPieChart
          desktopData={desktopData}
          chartConfig={chartConfigForSurveyType}
          bottomLegend={surveyType}
          title="Survey Type Distribution"
          months={[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ]}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        /> */}
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
