// import React from "react";
// import ReactApexChart from "react-apexcharts";

// const SubscriptionTrend: React.FC = () => {
//   const chartOptions = {
//     chart: {
//       type: "area",
//       height: 350,
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: ["#1E90FF", "#FF00FF", "#32CD32"], // Free plan, Pro plan, Premium plan
//     stroke: {
//       curve: "smooth",
//       width: 2,
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shade: "light",
//         type: "vertical",
//         shadeIntensity: 0.3,
//         opacityFrom: 0.4,
//         opacityTo: 0,
//       },
//     },
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       markers: {
//         radius: 2,
//       },
//     },
//     xaxis: {
//       categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     yaxis: {
//       labels: {
//         formatter: (value: number) => `${value}K`,
//       },
//     },
//     grid: {
//       borderColor: "#E5E7EB",
//       strokeDashArray: 4,
//     },
//     tooltip: {
//       theme: "light",
//     },
//   };

//   const chartSeries = [
//     {
//       name: "Free plan",
//       data: [10, 15, 20, 30, 35, 25, 40],
//     },
//     {
//       name: "Pro plan",
//       data: [5, 10, 15, 25, 30, 20, 30],
//     },
//     {
//       name: "Premium plan",
//       data: [2, 8, 12, 22, 28, 18, 25],
//     },
//   ];

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-4 max-w-5xl mx-auto">
//       <div className="flex items-center justify-between mb-2">
//         <h2 className="text-lg font-semibold text-gray-800">Subscription Trend</h2>
//         <div className="flex space-x-6 text-gray-500 text-sm">
//           <span className="cursor-pointer hover:text-gray-800">New Users</span>
//           <span className="cursor-pointer hover:text-gray-800">Operating Status</span>
//         </div>
//       </div>
//       <hr className="border-gray-200 mb-4" />
//       <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={300} />
//     </div>
//   );
// };

// export default SubscriptionTrend;


// import React from "react";
// import ReactApexChart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";

// const SubscriptionTrend: React.FC = () => {
//   const chartOptions: ApexOptions = {
//     chart: {
//       type: "area", // Explicitly matches the ApexOptions type
//       height: 350,
//       toolbar: {
//         show: false,
//       },
//     },
//     colors: ["#1E90FF", "#FF00FF", "#32CD32"], // Free plan, Pro plan, Premium plan
//     stroke: {
//       curve: "smooth",
//       width: 2,
//     },
//     fill: {
//       type: "gradient",
//       gradient: {
//         shade: "light",
//         type: "vertical",
//         shadeIntensity: 0.3,
//         opacityFrom: 0.4,
//         opacityTo: 0,
//       },
//     },
//     legend: {
//       position: "top",
//       horizontalAlign: "right",
//       markers: {
//         radius: 2,
//       },
//     },
//     xaxis: {
//       categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     yaxis: {
//       labels: {
//         formatter: (value: number) => `${value}K`,
//       },
//     },
//     grid: {
//       borderColor: "#E5E7EB",
//       strokeDashArray: 4,
//     },
//     tooltip: {
//       theme: "light",
//     },
//   };

//   const chartSeries = [
//     {
//       name: "Free plan",
//       data: [10, 15, 20, 30, 35, 25, 40],
//     },
//     {
//       name: "Pro plan",
//       data: [5, 10, 15, 25, 30, 20, 30],
//     },
//     {
//       name: "Premium plan",
//       data: [2, 8, 12, 22, 28, 18, 25],
//     },
//   ];

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-4 max-w-5xl mx-auto">
//       <div className="flex items-center justify-between mb-2">
//         <h2 className="text-lg font-semibold text-gray-800">Subscription Trend</h2>
//         <div className="flex space-x-6 text-gray-500 text-sm">
//           <span className="cursor-pointer hover:text-gray-800">New Users</span>
//           <span className="cursor-pointer hover:text-gray-800">Operating Status</span>
//         </div>
//       </div>
//       <hr className="border-gray-200 mb-4" />
//       <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={300} />
//     </div>
//   );
// };

// export default SubscriptionTrend;


import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useSubscriptionTrendQuery } from "@/services/superadmin.service";

const SubscriptionTrend: React.FC = () => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area", 
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#1E90FF", "#FF00FF", "#32CD32"], // Free plan, Pro plan, Premium plan
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.3,
        opacityFrom: 0.4,
        opacityTo: 0,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}K`,
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "light",
    },
  };

  const chartSeries = [
    {
      name: "Free plan",
      data: [10, 15, 20, 30, 35, 25, 40],
    },
    {
      name: "Pro plan",
      data: [5, 10, 15, 25, 30, 20, 30],
    },
    {
      name: "Premium plan",
      data: [2, 8, 12, 22, 28, 18, 25],
    },
  ];

  const {data} = useSubscriptionTrendQuery(null)
  console.log(data)

  return (
    <div className=" w-full">
      {/* <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">Subscription Trend</h2>
        <div className="flex space-x-6 text-gray-500 text-sm">
          <span className="cursor-pointer hover:text-gray-800">New Users</span>
          <span className="cursor-pointer hover:text-gray-800">Operating Status</span>
        </div>
      </div> */}
      {/* <hr className="border-gray-200 mb-4" /> */}
      <ReactApexChart options={chartOptions} series={chartSeries} type="area" height={300} />
    </div>
  );
};

export default SubscriptionTrend;
