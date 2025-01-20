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

interface SurveyTypeItem {
  type: string;
  percentage: number;
}

export function SurveyTypeChart() {
  const [month, setMonth] = React.useState("January");
  const [year, setYear] = React.useState("2024");
  const [fetchSurveyData, { data = [], isLoading }] =
    useLazySurveyTypeDistributionQuery();

  const chartData = React.useMemo(() => {
    return data?.data?.map((item: SurveyTypeItem) => ({
      name: item.type,
      value: item.percentage,
      fill: `var(--color-${item.type.toLowerCase()})`,
    }));
  }, [data]);

  console.log(data);

  React.useEffect(() => {
    fetchSurveyData({ month, year });
  }, [month, year, fetchSurveyData]);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const handlePieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Survey Type Distribution</CardTitle>
          <CardDescription>
            Select month and year to view distribution
          </CardDescription>
        </div>
        <Select value={month} onValueChange={(value) => setMonth(value)}>
          <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5">
            <SelectValue placeholder="Select month" />
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
          <SelectTrigger className="ml-auto h-7 w-[100px] rounded-lg pl-2.5">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {[2023, 2024, 2025].map((key) => (
              <SelectItem
                key={key}
                value={key.toString()}
                className="rounded-lg"
              >
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <PieChart width={300} height={300}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={80}
            activeIndex={activeIndex}
            onMouseEnter={handlePieEnter}

            activeShape={(props: any) => (
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
              }}
            />
          </Pie>
        </PieChart>
      </CardContent>
    </Card>
  );
}
