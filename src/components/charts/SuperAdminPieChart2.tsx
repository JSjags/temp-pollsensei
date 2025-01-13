"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLazySurveyTypeDistributionQuery } from "@/services/superadmin.service";

interface SuperAdminPieChartProps {
  chartConfig: Record<string, any>;
  bottomLegend: string[];
  title: string;
}

export function SuperAdminPieChart2({
  chartConfig,
  bottomLegend,
  title,
}: SuperAdminPieChartProps) {
  const [month, setMonth] = React.useState("January");
  const [year, setYear] = React.useState("2025");
  const [fetchSurveyData, { data = [], isLoading }] = useLazySurveyTypeDistributionQuery();

  // Transform data for PieChart
  const chartData = React.useMemo(() => {
    if (!data || !data.data) return [];
  
    return [
      {
        name: "Quantitative",
        value: data.data.quantitative_percentage || 0,
        fill: "#5B03B2",
      },
      {
        name: "Qualitative",
        value: data.data.qualitative_percentage || 0,
        fill: "#E9D7FB",
      },
      {
        name: "Both",
        value: data.data.both_percentage || 0,
        fill: "#9B51E0",
      },
    ];
  }, [data]);
  

  React.useEffect(() => {
    fetchSurveyData({ month, year });
  }, [month, year, fetchSurveyData]);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const handlePieEnter = (_:any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-sm font-medium text-gray-800">{title}</CardTitle>
          {/* <CardDescription>Select month and year to view distribution</CardDescription> */}
        </div>
        <Select
  value={month}
  onValueChange={(value) => {
    console.log("Selected Month:", value);
    setMonth(value); // Updates the state
  }}
>
  <SelectTrigger
    className="ml-auto h-7 w-auto rounded-lg pl-2.5"
    aria-label="Select a month"
  >
    <SelectValue placeholder="Select month" />
    <span>{month}</span> {/* Display current state */}
  </SelectTrigger>
  <SelectContent align="end" className="rounded-xl">
    {[
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].map((key) => (
      <SelectItem key={key} value={key} className="rounded-lg">
        {key}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
        <Select value={year} onValueChange={(value) => setYear(value)}>
          <SelectTrigger
            className="ml-2 h-7 w-auto rounded-lg pl-2.5"
            aria-label="Select a year"
          >
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          {/* <SelectContent align="end" className="rounded-xl">
            {[2023, 2024, 2025].map((key) => (
            // @ts-expect-error
              <SelectItem key={key} value={key} className="rounded-lg">
                {key}
              </SelectItem>
            ))}
          </SelectContent> */}
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <PieChart width={300} height={300}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={80}
              activeIndex={activeIndex}
              onMouseEnter={handlePieEnter}
              activeShape={(props:any) => (
                <Sector {...props} outerRadius={props.outerRadius + 10} />
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {chartData[activeIndex]?.value || 0}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          {chartData[activeIndex]?.name || ""}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        )}
      </CardContent>
      <div className="mt-4 flex justify-center space-x-6">
        {bottomLegend?.map((label, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 ${
                idx === 0
                  ? "bg-purple-800"
                  : idx === 1
                  ? "bg-purple-400"
                  : "bg-purple-200"
              }`}
            ></div>
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
