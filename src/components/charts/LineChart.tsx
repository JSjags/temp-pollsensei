"use client";

import React, { useState, useMemo, useEffect } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import "./style.css";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface DataItem {
  [key: string]: string | number;
}

interface GroupedData {
  [year: string]: {
    [month: string]: number;
  };
}

const groupDataByMonth = (
  data: DataItem[],
  xKey: string,
  yKey: string
): GroupedData => {
  const groupedData: GroupedData = {};

  data?.forEach((item) => {
    const date = dayjs(item[xKey] as string);
    const month = date.format("MMM");
    const year = date.format("YYYY");

    if (!groupedData[year]) {
      groupedData[year] = {};
    }
    if (!groupedData[year][month]) {
      groupedData[year][month] = 0;
    }
    groupedData[year][month] += parseFloat(item[yKey] as string);
  });

  return groupedData;
};

interface LineChartProps {
  data: DataItem[];
  xKey: string;
  yKey: string;
}

const LineChart: React.FC<LineChartProps> = ({ data, xKey, yKey }) => {
  const [filter, setFilter] = useState<string>("year");
  const [selectedYear, setSelectedYear] = useState<string>(
    dayjs().format("YYYY")
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const groupedData = useMemo(
    () => groupDataByMonth(data, xKey, yKey),
    [data, xKey, yKey]
  );

  const filteredData = useMemo(() => {
    let result: { x: string; y: number }[] = [];

    if (filter === "year" && groupedData[selectedYear]) {
      result = Object.entries(groupedData[selectedYear]).map(
        ([month, value]) => ({
          x: month,
          y: value,
        })
      );
    } else if (filter === "30-days") {
      const endDate = dayjs();
      const startDate = endDate.subtract(30, "day");
      result = data
        .filter((item) => {
          const date = dayjs(item[xKey] as string);
          return date.isAfter(startDate) && date.isBefore(endDate);
        })
        .map((item) => ({
          x: dayjs(item[xKey] as string).format("MMM D"),
          y: parseFloat(item[yKey] as string),
        }));
    } else if (filter === "7-days") {
      const endDate = dayjs();
      const startDate = endDate.subtract(7, "day");
      result = data
        .filter((item) => {
          const date = dayjs(item[xKey] as string);
          return date.isAfter(startDate) && date.isBefore(endDate);
        })
        .map((item) => ({
          x: dayjs(item[xKey] as string).format("MMM D"),
          y: parseFloat(item[yKey] as string),
        }));
    }

    return result;
  }, [filter, data, xKey, yKey, groupedData, selectedYear]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: filteredData.map((item) => item.x),
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: (value: number) => `${value}k`,
        style: {
          fontSize: "12px",
          fontFamily: "Inter",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
    },
    colors: ["#091E42"],
    tooltip: {
      x: {
        format: "MMM D",
      },
      y: {
        formatter: (value: number) => `${value}k`,
      },
    },
  };

  const handleButtonClick = (value: string) => {
    setFilter(value);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex flex-col w-full justify-between items-center">
      <div className="mt-5 flex justify-between items-center w-full px-5">
        <p className="chart-title hidden lg:block">Form response rate</p>
        <div className="flex gap-2">
          <button
            className={`filter-button ${filter === "year" ? "active" : ""}`}
            onClick={() => handleButtonClick("year")}
          >
            12 months
          </button>
          <button
            className={`filter-button ${filter === "30-days" ? "active" : ""}`}
            onClick={() => handleButtonClick("30-days")}
          >
            30 days
          </button>
          <button
            className={`filter-button ${filter === "7-days" ? "active" : ""}`}
            onClick={() => handleButtonClick("7-days")}
          >
            7 days
          </button>
          {filter === "year" && (
            <select
              className="filter-button"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Object.keys(groupedData).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div id="chart" className="w-full">
        <ReactApexChart
          options={options}
          series={[
            {
              name: "Sale",
              data: filteredData.map((item) => item.y),
            },
          ]}
          type="area"
          height={208}
        />
      </div>
    </div>
  );
};

export default LineChart;
