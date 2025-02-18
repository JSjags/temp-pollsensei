import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SentimentData {
  category: string[];
  count: number[];
}

interface SentimentGraph {
  type: string;
  x: string[];
  y: number[][];
}

interface TestProps {
  test_name: string;
  test_results: {
    results: Record<string, SentimentData>;
    graph: SentimentGraph;
    description: string;
  };
}

const SentimentAnalysisComponent: React.FC<{ data: TestProps }> = ({
  data,
}) => {
  const [selectedVariable, setSelectedVariable] = useState<string>(
    Object.keys(data.test_results.results)[0]
  );

  const selectedResult = data.test_results.results[selectedVariable];
  const chartData = selectedResult.category.map((cat, idx) => ({
    name: cat,
    value: selectedResult.count[idx],
  }));

  const stackedChartData = data.test_results.graph.x.map((category, idx) => ({
    name: category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
    Neutral: data.test_results.graph.y[idx][0],
    Positive: data.test_results.graph.y[idx][1],
    Negative: data.test_results.graph.y[idx][2],
  }));

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">{data.test_name}</h2>

      <Select
        onValueChange={setSelectedVariable}
        defaultValue={selectedVariable}
      >
        <SelectTrigger className="w-full md:w-72">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(data.test_results.results).map((variable) => (
            <SelectItem key={variable} value={variable}>
              {variable
                .split("_")
                .map(
                  (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Category Sentiment Distribution
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Overall Sentiment Distribution
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Neutral" fill="#64748b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Positive" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Negative" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Description</h3>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.test_results.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysisComponent;
