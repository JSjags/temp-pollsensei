import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useUsersByLocationQuery } from "@/services/superadmin.service";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";

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
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },

      background: "transparent",
    },
    colors: colorArray,
    labels: countryList,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "round",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Users",
              formatter: function (w: any) {
                const total = data?.data
                  ?.reduce((acc: number, curr: any) => acc + curr.count, 0)
                  .toString();
                return total;
              },
            },
            value: {
              formatter: function (val) {
                return parseFloat(val).toFixed(2) + "%";
              },
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(2)}%`,
      },
      theme: "dark",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const chartSeries = countryPercentage;

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center min-h-[300px] bg-white shadow-none border-none">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <div className="text-gray-400">Loading data...</div>
        </div>
      </Card>
    );
  }

  if (!data?.data?.length) {
    return (
      <Card className="flex items-center justify-center min-h-[300px] shadow-none border-none">
        <div className="text-gray-500">No location data available</div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 h-auto min-h-[300px] bg-white p-4 w-full transition-all duration-200 hover:shadow-xl">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-gray-800">
            Users by Location
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={280}
            />
          </div>

          <div className="relative w-full md:w-1/2">
            <div className="absolute right-0 top-0 h-8 w-full bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
            <div className="absolute right-0 bottom-0 h-8 w-full bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>

            <div className="w-full max-h-[280px] py-4 overflow-auto custom-scrollbar">
              <table className="w-full min-w-[400px] border-separate border-spacing-0">
                <tbody>
                  {data?.data?.map((item: any, index: any) => (
                    <tr
                      key={item._id}
                      className="group hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="sticky left-0 bg-white group-hover:bg-gray-50 w-[180px] transition-colors duration-200 border-r border-gray-100">
                        <div className="flex items-center py-2 pr-4">
                          <div
                            className="w-3 h-3 rounded-full mr-3 flex-shrink-0"
                            style={{
                              backgroundColor:
                                colorArray[index % colorArray?.length],
                            }}
                          ></div>
                          <span className="font-medium truncate">
                            {item.country}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-gray-500 text-sm border-r border-gray-100">
                        {item.count.toLocaleString()} users
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-right font-semibold min-w-[100px]">
                        {item?.percentage?.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Add custom scrollbar styles to your globals.css
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

export default dynamic(() => Promise.resolve(UsersByLocation), { ssr: false });
