"use client";

import React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { FadeLoader } from "react-spinners";

interface CircleData {
  value: number; // Percentage
  color: string; // Background color
  size: number; // Diameter in pixels
}

interface OverlappingCirclesProps {
  circles: CircleData[];
  desktopData: { month: string; value: number; fill: string }[];
  chartConfig: ChartConfig;
  bottomLegend: string[];
  title: string;
  isLoading: boolean;
}

const OverlappingCircles: React.FC<OverlappingCirclesProps> = ({
  circles,
  desktopData,
  chartConfig,
  bottomLegend,
  title,
  isLoading,
}) => {
  const id = "pie-interactive";
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].month);

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  );
  const plans = React.useMemo(
    () => desktopData.map((item) => item.month),
    [desktopData]
  );
  return (
    <Card data-chart={id} className="flex flex-col w-full">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle className="text-sm font-medium text-gray-800">
            {title}
          </CardTitle>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-7 w-auto rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {plans.map((key) => {
              const config = chartConfig[key as keyof typeof chartConfig];

              if (!config) {
                return null;
              }

              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: `var(--color-${key})`,
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {isLoading ? (
          <>
            <div className="text-center ">
              <span className="flex justify-center items-center">
                <FadeLoader height={10} radius={1} className="mt-3" />
              </span>
            </div>
          </>
        ) : (
          <div className="relative flex justify-center items-center">
            {circles.map((circle, index) => (
              <div
                key={index}
                className="absolute flex justify-center items-center rounded-full text-white font-bold"
                style={{
                  backgroundColor: circle.color,
                  width: `${circle.size}px`,
                  height: `${circle.size}px`,
                  zIndex: index,
                  transform: `translate(${index * 70}px, ${index * 0}px)`,
                }}
              >
                <span>{circle.value}%</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="mt-4 flex justify-center space-x-6">
        {bottomLegend?.map((label, idx) => (
          <div key={idx} className="flex items-center space-x-2">
            <div
              className={`w-2 h-2  ${
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
};

export default OverlappingCircles;
