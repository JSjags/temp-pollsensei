"use client";

import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface DataPoint {
  label: string;
  value: number;
}

interface DonutChartProps {
  seriesData: DataPoint[];
}

const DonutChart: React.FC<DonutChartProps> = ({ seriesData }) => {
  const options: ApexOptions = {
    chart: {
      width: "100%",
      height: "100%",
      type: "donut",
    },
    legend: {
      position: "left",
      // show: false,
    },
    colors: ["#3D7100", "#FFC327", "#D9D9D9"],
    labels: seriesData.map((dataPoint) => dataPoint.label),
    plotOptions: {
      pie: {
        donut: {
          size: "100%",
        },
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart
        options={options}
        series={seriesData.map((dataPoint) => dataPoint.value)}
        type="donut"
        height="100%"
      />
    </div>
  );
};

export default DonutChart;
