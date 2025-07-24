import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useSubscriptionTrendQuery } from "@/services/superadmin.service";

interface SubscriptionTrendProps {
  timeRange: "6months" | "1year";
}

type InputData = {
  month: string;
  basic: number;
  pro: number;
  team: number;
}[];

type ChartSeries = {
  name: string;
  data: number[];
}[];

const SubscriptionTrend: React.FC<SubscriptionTrendProps> = ({ timeRange }) => {
  // Convert timeRange to period parameter
  const getPeriod = () => {
    switch (timeRange) {
      case "6months":
        return "6 months";
      case "1year":
        return "1 year";
      default:
        return "6 months";
    }
  };

  const { data, isLoading, isFetching } = useSubscriptionTrendQuery(
    getPeriod()
  );

  const months =
    data?.data?.map((item: any) => {
      const [month] = item.month.split(" ");
      return month.slice(0, 3);
    }) || [];

  function transformDataToChartSeries(data: InputData): ChartSeries {
    if (!data) return [];

    return [
      {
        name: "Free plan",
        data: data?.map((item) => item?.basic) || [],
      },
      {
        name: "Pro plan",
        data: data?.map((item) => item?.pro) || [],
      },
      {
        name: "Premium plan",
        data: data?.map((item) => item?.team) || [],
      },
    ];
  }

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#1E90FF", "#FF00FF", "#32CD32"],
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
      categories: months,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => `${value}`,
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

  const chartSeries = transformDataToChartSeries(data?.data);

  if (isLoading || isFetching) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-white/50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <ReactApexChart
        options={{
          ...chartOptions,
          chart: {
            ...chartOptions.chart,
            fontFamily: "DM Sans",
          },
        }}
        series={chartSeries}
        type="area"
        height={300}
      />
    </div>
  );
};

export default SubscriptionTrend;
