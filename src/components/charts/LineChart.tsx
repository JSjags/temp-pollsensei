"use client";

import * as React from "react";
import { format, parse } from "date-fns";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { getPasswordResetCode, getResponseRate } from "@/services/admin";
import { useWindowSize } from "@/hooks/useWindowSize";

type Period = "week" | "month" | "year";

export default function ResponseRateDashboard() {
  const [period, setPeriod] = React.useState<Period>("year");
  const { width } = useWindowSize();
  const isMobile = width < 640;
  const isTablet = width >= 640 && width < 1024;

  const { data, isLoading } = useQuery({
    queryKey: ["response-rate", period],
    queryFn: () => getResponseRate(period),
  });

  const chartData = React.useMemo(() => {
    if (!data?.data.data || data.data.data.length === 0) return [];

    return data.data.data
      .map((item: any) => {
        try {
          let date;
          if (item.date) {
            date = new Date(item.date);
          } else if (item.month_name && item.year) {
            date = parse(item.month_name, "MMMM", new Date(item.year, 0));
          } else {
            date = new Date(item.year, item.month ? item.month - 1 : 0);
          }

          if (isNaN(date.getTime())) {
            console.warn("Invalid date encountered:", item);
            return null;
          }

          return {
            date,
            value: item.response_count,
            label: isMobile
              ? format(date, "MMM") // Shorter format for mobile
              : item.month_name || item.day_name || format(date, "yyyy"),
          };
        } catch (error) {
          console.warn("Error processing chart data item:", item, error);
          return null;
        }
      })
      .filter(Boolean);
  }, [data, isMobile]);

  const loadingData = React.useMemo(() => {
    const count = period === "year" ? 12 : period === "month" ? 30 : 7;
    return Array(count).fill({ value: 0, label: "" });
  }, [period]);

  const emptyData = React.useMemo(() => {
    const count = period === "year" ? 12 : period === "month" ? 30 : 7;
    return Array(count).fill({ value: 0, label: "" });
  }, [period]);

  const displayData = isLoading
    ? loadingData
    : chartData.length === 0
    ? emptyData
    : chartData;

  const getChartHeight = () => {
    if (isMobile) return 180;
    if (isTablet) return 200;
    return 220;
  };

  return (
    <Card className="col-span-4 w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 pb-4 sm:pb-7">
        <CardTitle className="text-sm sm:text-base font-normal">
          Form response rate
        </CardTitle>
        <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
          <Button
            variant={period === "year" ? "secondary" : "ghost"}
            onClick={() => setPeriod("year")}
            className="text-[10px] sm:text-xs p-1 sm:p-2 h-7 sm:h-8 flex-1 sm:flex-none"
            disabled={isLoading}
          >
            12 months
          </Button>
          <Button
            variant={period === "month" ? "secondary" : "ghost"}
            onClick={() => setPeriod("month")}
            className="text-[10px] sm:text-xs p-1 sm:p-2 h-7 sm:h-8 flex-1 sm:flex-none"
            disabled={isLoading}
          >
            30 days
          </Button>
          <Button
            variant={period === "week" ? "secondary" : "ghost"}
            onClick={() => setPeriod("week")}
            className="text-[10px] sm:text-xs p-1 sm:p-2 h-7 sm:h-8 flex-1 sm:flex-none"
            disabled={isLoading}
          >
            7 days
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2 sm:pb-4 px-2 sm:px-4">
        <div style={{ height: getChartHeight() }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={displayData}
              margin={{
                top: 5,
                right: isMobile ? 5 : 10,
                left: isMobile ? 0 : 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="rgb(75 85 99)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="100%"
                    stopColor="rgb(75 85 99)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={true}
                dy={isMobile ? 5 : 10}
                tick={{
                  fill: "rgb(107 114 128)",
                  fontSize: isMobile ? "0.625rem" : "0.75rem",
                }}
                stroke="rgb(229 231 235)"
                strokeOpacity={0.4}
                interval={isMobile ? 2 : 0}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                dx={isMobile ? -5 : -10}
                tick={{
                  fill: "rgb(107 114 128)",
                  fontSize: isMobile ? "0.625rem" : "0.75rem",
                }}
                width={isMobile ? 30 : 40}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (
                    !active ||
                    !payload ||
                    isLoading ||
                    chartData.length === 0
                  )
                    return null;
                  try {
                    const date = payload[0]?.payload?.date;
                    const dateDisplay =
                      period === "year"
                        ? format(date, isMobile ? "MMM yyyy" : "MMMM yyyy")
                        : format(date, isMobile ? "MM/dd/yy" : "PPP");

                    return (
                      <div className="rounded-lg border bg-background p-1.5 sm:p-2 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] sm:text-xs uppercase text-muted-foreground">
                            {dateDisplay}
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold">
                            {payload[0].value} responses
                          </span>
                        </div>
                      </div>
                    );
                  } catch (error) {
                    console.warn("Error rendering tooltip:", error);
                    return null;
                  }
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={
                  isLoading || chartData.length === 0
                    ? "rgb(107 114 128)"
                    : "rgb(0 0 0)"
                }
                strokeWidth={1}
                fill={
                  isLoading || chartData.length === 0
                    ? "none"
                    : "url(#gradient)"
                }
                dot={false}
                style={
                  isLoading || chartData.length === 0
                    ? { opacity: 0.5 }
                    : undefined
                }
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
