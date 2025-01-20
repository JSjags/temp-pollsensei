import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const TrafficByDevice: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#8E24AA", "#E1BEE7", "#000000", "#F48FB1", "#A5D6A7", "#BDBDBD"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 10, 
        distributed: true, 
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Linux", "Mac", "iOS", "Windows", "Android", "Other"],
      labels: {
        style: {
          colors: "#9E9E9E",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}K`,
        style: {
          colors: "#9E9E9E",
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#E0E0E0",
    },
    legend: {
      show: false,
    },
  };

  const chartSeries = [
    {
      name: "Traffic",
      data: [10, 25, 15, 30, 8, 18],
    },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Traffic by Device</h2>
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
      <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={200} />
    </div>
  );
};

export default TrafficByDevice;
