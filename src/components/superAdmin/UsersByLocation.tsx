import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useUsersByLocationQuery } from "@/services/superadmin.service";
import dynamic from "next/dynamic";

type CountryData = {
  _id: string;
  count: number;
  country: string;
  percentage: number;
}[];

function generateColorArray(length: number): string[] {
  const baseColors = ["#4A148C", "#8E24AA", "#CE93D8", "#E0E0E0"];
  return Array.from({ length }, (_, i) => baseColors[i % baseColors.length]);
}

const UsersByLocation: React.FC = () => {
  const { data, isLoading } = useUsersByLocationQuery("");

  function extractCountryList(data: CountryData): string[] {
    return data?.map((item) => item?.country);
  }

  function extractPercentageList(data: CountryData): number[] {
    return data?.map((item) => item?.percentage);
  }

  const countryList = data?.data ? extractCountryList(data.data) : [];
  const countryPercentage = data?.data ? extractPercentageList(data.data) : [];
  const colorArray = generateColorArray(countryList.length);

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      height: 200,
    },
    colors: colorArray,
    labels: countryList,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(1)}%`,
      },
    },
  };

  const chartSeries = countryPercentage;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.data?.length) {
    return <div>No data available</div>;
  }

  return (
    <div className="flex-1 h-[300px] bg-white shadow-lg rounded-lg p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Users by Location</h2>
        <div className="flex space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-transparent border-2 border-purple-700 rounded-full"></div>
            <span className="text-gray-600">Free users</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-purple-700 rounded-full"></div>
            <span className="text-gray-600">Paid users</span>
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <ReactApexChart options={chartOptions} series={chartSeries} type="donut" height={200} />
        <div className="ml-4 space-y-2 text-gray-700 text-sm">
      {data?.data?.map((item:any, index:any) => (
        <div className="flex items-center justify-between gap-1" key={item._id}>
          <span className="flex items-center">
            <div
              className="w-2.5 h-2.5 rounded-full mr-2"
              style={{ backgroundColor: colorArray[index % colorArray?.length] }}
            ></div>
            {item.country}
          </span>
          <span>{item?.percentage?.toFixed(2)}%</span>
        </div>
      ))}
    </div>
      </div>
    </div>
  );
};
export default dynamic(() => Promise.resolve(UsersByLocation), { ssr: false });