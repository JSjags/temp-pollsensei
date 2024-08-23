"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface CircleChartsProps {
  data: {
    offline_users_count?: number;
    online_users_count?: number;
    total_users_count?: number;
  };
}

const CircleCharts: React.FC<CircleChartsProps> = ({ data }) => {
  const seriesData = [
    data?.offline_users_count || 0,
    data?.online_users_count || 0,
    data?.total_users_count || 0,
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Total",
            formatter: function (w) {
              return data?.total_users_count?.toString() || "0";
            },
          },
        },
      },
    },
    labels: ["Offline", "Online", "Total Users"],
    colors: ["#FF9500", "#02BA09", "#FF3A29"],
    legend: {
      show: true,
      position: "bottom",
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={seriesData}
      type="radialBar"
      height={350}
    />
  );
};

export default CircleCharts;
