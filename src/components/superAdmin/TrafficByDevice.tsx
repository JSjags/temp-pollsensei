import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Card } from "../ui/card";

const TrafficByDevice: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      height: "100%",
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
    <Card className="flex-1 flex flex-col h-full bg-white rounded-lg p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Traffic by Device
        </h2>
      </div>
      <div className="flex-1">
        <ReactApexChart
          options={{
            ...chartOptions,
            chart: {
              ...chartOptions.chart,
              fontFamily: "DM Sans",
            },
          }}
          series={chartSeries}
          type="bar"
          height="100%"
          width="100%"
        />
      </div>
    </Card>
  );
};

export default TrafficByDevice;
