"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector, ResponsiveContainer } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cell } from "recharts";

interface SuperAdminPieChartProps {
  desktopData: { month: string; value: number; fill: string }[];
  chartConfig: ChartConfig;
  bottomLegend: string[];
  title: string;
  months: string[];
  year: string[];
  selectedMonth: string;
  isLoading: boolean;
  selectedYear: string;
  onMonthChange: (month: string) => void;
  onYearChange: (month: string) => void;
}

export function SuperAdminPieChart({
  desktopData,
  chartConfig,
  bottomLegend,
  title,
  isLoading,
  months,
  year,
  selectedMonth,
  selectedYear,
  onYearChange,
  onMonthChange,
}: SuperAdminPieChartProps) {
  const id = "pie-interactive";
  const [activeIndex, setActiveIndex] = React.useState<number | undefined>();

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: PieSectorDataItem) => {
    const {
      cx = 0,
      cy = 0,
      innerRadius = 0,
      outerRadius = 0,
      startAngle = 0,
      endAngle = 0,
      fill = "#000",
      payload,
      percent = 0,
      value = 0,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cornerRadius={4}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 15}
          outerRadius={outerRadius + 15}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <Card
      data-chart={id}
      className="flex flex-col w-full p-0 border-none shadow-none rounded-xl"
    >
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex flex-col gap-2 items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-base font-semibold text-gray-800">
            {title}
          </CardTitle>
        </div>
        <div className="flex w-full gap-2 justify-end">
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger
              className="h-7 w-auto rounded-lg pl-2.5"
              aria-label="Select month"
            >
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {months?.map((month) => (
                <SelectItem
                  key={month}
                  value={month}
                  className="rounded-lg [&_span]:flex"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={onYearChange}>
            <SelectTrigger
              className="h-7 w-auto rounded-lg pl-2.5"
              aria-label="Select year"
            >
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {year?.map((yr) => (
                <SelectItem
                  key={yr}
                  value={yr}
                  className="rounded-lg [&_span]:flex"
                >
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 justify-center min-h-[300px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={desktopData}
                  dataKey="value"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={1}
                  cornerRadius={4}
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  label={({ name, value, percent }) =>
                    `${Math.round(percent * 100)}%`
                  }
                  labelLine={false}
                >
                  {desktopData?.map((entry) => (
                    <Cell
                      key={`cell-${entry.month}`}
                      fill={entry.fill}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>

      <div className="mt-0 flex justify-center space-x-6">
        {bottomLegend?.map((label, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div
              className={`w-4 h-4 rounded-full ${
                idx === 0
                  ? "bg-purple-800"
                  : idx === 1
                  ? "bg-purple-400"
                  : "bg-purple-200"
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
