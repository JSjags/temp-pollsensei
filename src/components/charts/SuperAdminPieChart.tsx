"use client";

import * as React from "react";
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
// const desktopData = [
//   { month: "january", desktop: 186, fill: "var(--color-january)" },
//   { month: "february", desktop: 305, fill: "var(--color-february)" },
//   { month: "march", desktop: 237, fill: "var(--color-march)" },
// ];

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   desktop: {
//     label: "Desktop",
//   },
//   mobile: {
//     label: "Mobile",
//   },
//   january: {
//     label: "January",
//     color: "#5B03B2",
//   },
//   february: {
//     label: "February",
//     color: "#E9D7FB",
//   },
//   march: {
//     label: "March",
//     color: "#9B51E0",
//   },
// } satisfies ChartConfig;


// const bottomLegend = ["Free", "Pro", "Premium"]

interface SuperAdminPieChartProps {
  desktopData: { plan: string; subscriber: number; fill: string }[];
  chartConfig: ChartConfig;
  bottomLegend: string[];
  title:string;
}

export function SuperAdminPieChart({
  desktopData,
  chartConfig,
  bottomLegend,
  title,
}: SuperAdminPieChartProps) {
  const id = "pie-interactive";
  const [activeMonth, setActiveMonth] = React.useState(desktopData[0].plan);

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.plan === activeMonth),
    [activeMonth]
  );
  const plans = React.useMemo(() => desktopData.map((item) => item.plan), [desktopData]);

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
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={desktopData}
              dataKey="subscriber"
              nameKey="plan"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
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
                          {desktopData[activeIndex].subscriber.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
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
}
