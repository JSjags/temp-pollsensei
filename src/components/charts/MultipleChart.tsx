"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SeriesDataItem {
  x: string | number;
  y: number;
}

interface SeriesData {
  name: string;
  data: SeriesDataItem[];
}

interface MultipleChartProps {
  seriesData: SeriesData[];
  xKey: string;
  yKeys: string[];
}

const MultipleChart: React.FC<MultipleChartProps> = ({
  seriesData,
  xKey,
  yKeys,
}) => {
  // Extracting x-axis categories from the first series
  console.log(seriesData);
  const categories = seriesData[0]?.data?.map((item) => (item as any)[xKey]);

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: {
        show: false,
      },
      dropShadow: {
        enabled: true,
        color: "#000",
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.2,
      },
    },
    colors: ["#3D7100", "#FF3A29"],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: categories,
    },
    // yaxis: {
    //   title: {
    //     text: "Activity",
    //   },
    // },
    legend: {
      position: "top",
    },
    title: {
      text: "Users Analytics",
    },
  };

  const series = seriesData.map((series) => ({
    name: series.name,
    data: series.data?.map((point) => ({ x: point.x, y: point.y })),
  }));

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={350}
    />
  );
};

export default MultipleChart;
