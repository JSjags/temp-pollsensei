import React, { useState } from "react";
import { SuperAdminPieChart } from "../charts/SuperAdminPieChart";
import { ChartConfig } from "../ui/chart";
import {
  useSubscriptionDistributionQuery,
  useSurveyCreationDistributionQuery,
  useSurveyTypeDistributionQuery,
} from "@/services/superadmin.service";
import OverlappingCircles from "../charts/OverlappingCircle";
import { SurveyTypeChart } from "./SurveyTypeChart";
import { SuperAdminPieChart2 } from "../charts/SuperAdminPieChart2";
import SubscriptionTrend from "./SubscriptionTrend";
import UsersByLocation from "./UsersByLocation";
import TrafficByDevice from "./TrafficByDevice";
import { getMonthsFromCurrent, getCurrentAndLastYears } from "@/lib/utils";

const DashboardAnalytics: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2025");

  const [selectedMonth2, setSelectedMonth2] = useState("January");
  const [selectedYear2, setSelectedYear2] = useState("2025");
  // const
  const { data, isLoading, isSuccess, error, isFetching } =
    useSurveyCreationDistributionQuery({
      month: selectedMonth,
      year: selectedYear,
    });

  const { data:subScribe, isLoading:subIsLoading , isSuccess:subIsSuccess, isFetching:subIsFetching } =
    useSubscriptionDistributionQuery({
      month: selectedMonth,
      year: selectedYear,
    });

  const {
    data: surveyTypeDistribution,
    isLoading: typeLoading,
    isSuccess: typeSuccess,
    isFetching:typeFetching
  } = useSurveyTypeDistributionQuery({
    month: selectedMonth2,
    year: selectedYear2,
  });
  // console.log(data);
  console.log(subScribe);
  console.log(surveyTypeDistribution);
 

  const circles = [
    {
      value: Math.round(data?.data?.ai_generated_percentage),
      color: "#8E24AA", 
      size: 120,
    },
    {
      value: Math.round(data?.data?.manually_generated_percentage),
      color: "#E1BEE7", 
      size: 90,
    },
  ];

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
  const desktopData3 = [
    {
      month: "Basic",
      value: subScribe?.data?.basic_sub_percentage ?? 0,
      fill: "#5B03B2",
    },
    {
      month: "Business",
      value: subScribe?.data?.
      business_sub_percentage ?? 0,
      fill: "#9B51E0", // 
    },
    {
      month: "Pro",
      value: subScribe?.data?.
      pro_sub_percentage ?? 0,
      fill: "#E9D7FB",
    },
  ];

  const desktopData2 = [
    {
      month: data?.data?.month,
      value: Math.round(data?.data?.ai_generated_percentage),
      fill: "#8E24AA",
    },
    {
      month: data?.data?.month,
      value: Math.round(data?.data?.manually_generated_percentage),
      fill: "#E1BEE7",
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
  const planType = ["Basic", "Business", "Pro"];
  const createdBy = ["AI-Generated", "Manual",];
  return (
    <div className="p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SuperAdminPieChart
          desktopData={desktopData3}
          chartConfig={chartConfigForSurveyType}
          bottomLegend={planType}
          title="User Subscription Distribution"
          year={getCurrentAndLastYears()}
          months={getMonthsFromCurrent()}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          isLoading={subIsLoading || subIsFetching} 
        />

        {/* <SurveyTypeChart /> */}
        <OverlappingCircles
          desktopData={desktopData2}
          chartConfig={chartConfig}
          bottomLegend={createdBy}
          title="Creation Method Distribution"
          circles={circles}
          isLoading={ isLoading || isFetching}
        />

        <SuperAdminPieChart
          desktopData={desktopData}
          chartConfig={chartConfigForSurveyType}
          bottomLegend={surveyType}
          title="Survey Type Distribution"
          year={getCurrentAndLastYears()}
          months={getMonthsFromCurrent()}
          selectedYear={selectedYear2}
          onYearChange={setSelectedYear2}
          selectedMonth={selectedMonth2}
          onMonthChange={setSelectedMonth2}
          isLoading={typeLoading || typeFetching} 
        />
      </div>

      {/* Line Chart */}
      <div className="bg-white mt-8 p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-6">
            {["Subscription Trend"].map(
              // {["Subscription Trend", "New Users", "Operating Status"].map(
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
        </div>
        <div className=" bg-gray-100 rounded-lg flex w-full items-center justify-center">
          <SubscriptionTrend />
        </div>
      </div>

      <div className="flex justify-between items-center gap-4 mt-5">
        <UsersByLocation />
        <TrafficByDevice />
      </div>
    </div>
  );
};

export default DashboardAnalytics;
