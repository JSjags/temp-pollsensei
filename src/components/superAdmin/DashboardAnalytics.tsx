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
import { addDays, format } from "date-fns";

const DashboardAnalytics: React.FC = () => {
  // Get current month and year
  const currentMonth = format(new Date(), "MMMM");
  const currentYear = format(new Date(), "yyyy");

  // Update initial states to use current month/year
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedMonth2, setSelectedMonth2] = useState(currentMonth);
  const [selectedYear2, setSelectedYear2] = useState(currentYear);
  const [timeRange, setTimeRange] = useState<"6months" | "1year">("6months");

  const [selectedCreationMonth, setSelectedCreationMonth] =
    useState(currentMonth);
  const [selectedCreationYear, setSelectedCreationYear] = useState(currentYear);

  const { data, isLoading, isSuccess, error, isFetching } =
    useSurveyCreationDistributionQuery({
      month: selectedCreationMonth,
      year: selectedCreationYear,
    });

  const {
    data: subScribe,
    isLoading: subIsLoading,
    isSuccess: subIsSuccess,
    isFetching: subIsFetching,
  } = useSubscriptionDistributionQuery({
    month: selectedMonth,
    year: selectedYear,
  });

  const {
    data: surveyTypeDistribution,
    isLoading: typeLoading,
    isSuccess: typeSuccess,
    isFetching: typeFetching,
  } = useSurveyTypeDistributionQuery({
    month: selectedMonth2,
    year: selectedYear2,
  });

  console.log(subScribe);
  console.log(surveyTypeDistribution);

  const circles = [
    {
      value: Math.round(data?.data?.ai_generated_percentage),
      color: "#8E24AA",
      size: Math.max(60, Math.round(data?.data?.ai_generated_percentage * 1.5)),
    },
    {
      value: Math.round(data?.data?.manually_generated_percentage),
      color: "#E1BEE7",
      size: Math.max(
        60,
        Math.round(data?.data?.manually_generated_percentage * 1.5)
      ),
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
      value: subScribe?.data?.business_sub_percentage ?? 0,
      fill: "#9B51E0", //
    },
    {
      month: "Pro",
      value: subScribe?.data?.pro_sub_percentage ?? 0,
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
  const createdBy = ["AI-Generated", "Manual"];

  const handleTimeRangeChange = (range: "6months" | "1year") => {
    setTimeRange(range);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Subscription Distribution Card */}
        <div className="bg-white p-0 pb-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
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
        </div>

        {/* Creation Method Distribution Card */}
        <div className="bg-white p-0 pb-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
          <OverlappingCircles
            desktopData={desktopData2}
            chartConfig={chartConfig}
            bottomLegend={createdBy}
            title="Creation Method Distribution"
            circles={circles}
            isLoading={isLoading || isFetching}
            year={getCurrentAndLastYears()}
            months={getMonthsFromCurrent()}
            selectedYear={selectedCreationYear}
            onYearChange={setSelectedCreationYear}
            selectedMonth={selectedCreationMonth}
            onMonthChange={setSelectedCreationMonth}
          />
        </div>

        {/* Survey Type Distribution Card */}
        <div className="bg-white p-0 pb-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
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
      </div>

      {/* Subscription Trend Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center space-x-6">
              {["Subscription Trend"].map((tab, idx) => (
                <span
                  key={idx}
                  className={`text-base font-semibold ${
                    idx === 0
                      ? "text-gray-800 border-b-2 border-transparent"
                      : "text-gray-600"
                  } cursor-pointer hover:text-gray-800 transition-colors`}
                >
                  {tab}
                </span>
              ))}
            </div>

            {/* Add time range selector */}
            <div className="flex items-center space-x-3 text-sm">
              <button
                className={`px-3 py-1 rounded-full ${
                  timeRange === "6months"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                } hover:bg-purple-200`}
                onClick={() => handleTimeRangeChange("6months")}
              >
                6 Months
              </button>
              <button
                className={`px-3 py-1 rounded-full ${
                  timeRange === "1year"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                } hover:bg-gray-200`}
                onClick={() => handleTimeRangeChange("1year")}
              >
                1 Year
              </button>
            </div>
          </div>

          <div className="rounded-lg p-4">
            <SubscriptionTrend timeRange={timeRange} />
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Users by Location Card */}
        <div className="bg-white p-0 rounded-xl hover:shadow-md transition-shadow">
          <UsersByLocation />
        </div>

        {/* Traffic by Device Card */}
        <div className="bg-white p-0 rounded-xl hover:shadow-md transition-shadow">
          <TrafficByDevice />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
