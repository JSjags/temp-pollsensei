"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreVertical, Download, Trash2, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TestResult {
  overall_quality: any;
  country: any;
  address: any;
  age_range: any;
}

interface DataItem {
  test_name: string;
  test_results: TestResult | null;
}

interface Props {
  variable_id: string;
  survey_id: string;
  data: DataItem[];
  stats_test_result_id: string;
}

const COLORS = ["#9F7AEA", "#F6AD55", "#4299E1", "#F687B3"];

const TestAnalysisReport: React.FC<Props> = ({ data }) => {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const renderDonutChart = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    let accumulatedPercentage = 0;

    return (
      <div className="flex items-center justify-center space-x-8">
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {Object.entries(data).map(([key, value], index) => {
              const percentage = (value / total) * 100;
              const startAngle = accumulatedPercentage * 3.6;
              const endAngle = (accumulatedPercentage + percentage) * 3.6;

              accumulatedPercentage += percentage;

              const x1 =
                50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180));
              const y1 =
                50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180));
              const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180));
              const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180));

              const largeArcFlag = percentage > 50 ? 1 : 0;

              return (
                <path
                  key={key}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={COLORS[index % COLORS.length]}
                />
              );
            })}
            <circle cx="50" cy="50" r="25" fill="white" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl font-bold">{total}</div>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {Object.entries(data).map(([key, value], index) => (
            <div key={key} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm font-medium">{key}</span>
              <span className="text-sm font-bold">
                {((value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProgressBars = (data: Record<string, number>) => {
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);
    return (
      <div className="space-y-4">
        {Object.entries(data).map(([label, value], index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex-grow">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${(value / total) * 100}%`,
                    backgroundColor: COLORS[index % COLORS.length],
                  }}
                />
              </div>
            </div>
            <div className="w-24 text-right text-sm">{label}</div>
            <div className="w-16 text-right font-semibold text-sm">
              {((value / total) * 100).toFixed(0)}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            ANOVA Test Analysis
          </CardTitle>
          <span className="text-sm text-muted-foreground bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
            Analysis of Variance Analysis of the survey
          </span>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-2">
              CareConnect: Your Voice Matters
            </h2>
            <p className="text-gray-600">
              Help us understand what matters most to you! Our patient
              satisfaction survey, CareConnect, is designed to gather your
              feedback and insights on your recent healthcare experience. Your
              input will enable us to improve our care, services, and overall
              patient experience. Take a few minutes to share your thoughts and
              help us shape the future of healthcare.
            </p>
          </div>
          <div className="space-y-8">
            {data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{item.test_name}</h3>
                    <div className="flex space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Remove</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedItems.includes(index) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.test_results?.overall_quality && (
                          <div className="mb-6">
                            {renderDonutChart(
                              item.test_results.overall_quality
                            )}
                          </div>
                        )}
                        {item.test_results?.age_range && (
                          <div className="mb-6">
                            {renderProgressBars(item.test_results.age_range)}
                          </div>
                        )}
                        <div className="mt-6">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="p-2 text-left">Labels</th>
                                <th className="p-2 text-left">Frequency</th>
                                <th className="p-2 text-left">Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(
                                item.test_results?.overall_quality ||
                                  item.test_results?.age_range ||
                                  {}
                              ).map(([label, value], idx) => (
                                <tr key={idx} className="border-b">
                                  <td className="p-2">{label}</td>
                                  <td className="p-2">{value}</td>
                                  <td className="p-2">
                                    {(
                                      ((value as number) /
                                        Object.values(
                                          item.test_results?.overall_quality ||
                                            item.test_results?.age_range ||
                                            {}
                                        ).reduce(
                                          (a, b) => a + (b as number),
                                          0
                                        )) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="font-semibold">
                                <td className="p-2">Total</td>
                                <td className="p-2">
                                  {Object.values(
                                    item.test_results?.overall_quality ||
                                      item.test_results?.age_range ||
                                      {}
                                  ).reduce((a, b) => a + (b as number), 0)}
                                </td>
                                <td className="p-2">100%</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Button
                    variant="ghost"
                    onClick={() => toggleItem(index)}
                    className="mt-4 w-full justify-center"
                  >
                    {expandedItems.includes(index)
                      ? "Hide Details"
                      : "Show Details"}
                    <ChevronDown
                      className={`ml-2 h-4 w-4 transform transition-transform ${
                        expandedItems.includes(index) ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-center space-x-4">
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          Generate Report
        </Button>
        <Button variant="outline">Regenerate</Button>
      </div>
    </div>
  );
};

export default TestAnalysisReport;
