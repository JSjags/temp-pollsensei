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
import ReactWordcloud from "react-wordcloud";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";

interface WordData {
  words: string[];
  frequency: number[];
  percentage: number[];
}

interface WordGraph {
  type: string;
  x: number[];
  y: string[];
}

interface TestProps {
  test_name: string;
  test_results: {
    results: Record<string, WordData>;
    graph: WordGraph;
    description: string;
  };
}

const WordFrequencyAnalysisComponent: React.FC<{ data: TestProps }> = ({
  data,
}) => {
  const [selectedVariable, setSelectedVariable] = useState<string>(
    Object.keys(data.test_results.results)[0]
  );

  const selectedResult = data.test_results.results[selectedVariable];

  // Prepare data for word cloud
  const wordCloudData = selectedResult.words.map((word, idx) => ({
    text: word,
    value: selectedResult.frequency[idx],
  }));

  // Prepare data for horizontal bar chart
  const barChartData = selectedResult.words
    .map((word, idx) => ({
      word,
      frequency: selectedResult.frequency[idx],
      percentage: selectedResult.percentage[idx] || 0,
    }))
    .sort((a, b) => b.frequency - a.frequency);

  // Add download function for Recharts
  const downloadChart = (chartId: string, filename: string) => {
    const chartSvg = document
      .querySelector(`#${chartId}`)
      ?.querySelector("svg");
    if (chartSvg) {
      const svgData = new XMLSerializer().serializeToString(chartSvg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const downloadUrl = URL.createObjectURL(svgBlob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${filename}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  // Fix word cloud options type
  const wordCloudOptions = {
    colors: [
      "#8b5cf6",
      "#6366f1",
      "#3b82f6",
      "#0ea5e9",
      "#06b6d4",
      "#0891b2",
      "#4f46e5",
    ] as string[],
    enableTooltip: true,
    deterministic: false,
    fontFamily: "Inter",
    fontSizes: [24, 80] as [number, number],
    fontStyle: "normal",
    fontWeight: "bold",
    padding: 2,
    rotations: 3,
    rotationAngles: [0, 90] as [number, number],
    scale: "sqrt" as const,
    spiral: "archimedean" as const,
    transitionDuration: 1000,
  };

  // Replace downloadWordCloud function
  const downloadWordCloud = async () => {
    const element = document.querySelector("#word-cloud-content");
    if (!element) {
      console.error("Element not found");
      return;
    }

    try {
      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: "#FFFFFF",
        scale: 2, // Higher quality
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "word-cloud.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading word cloud:", error);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {data.test_name}
      </h2>

      <Select
        onValueChange={setSelectedVariable}
        defaultValue={selectedVariable}
      >
        <SelectTrigger className="w-full md:w-80">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Word Cloud
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadWordCloud}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div id="word-cloud-content" className="h-[500px] w-full bg-white">
              <ReactWordcloud
                words={wordCloudData}
                options={wordCloudOptions}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden lg:col-span-2">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                Word Frequency Distribution
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  downloadChart("frequency-chart", "word-frequency")
                }
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[600px]" id="frequency-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" />
                  <YAxis
                    type="category"
                    dataKey="word"
                    width={60}
                    style={{ fontSize: "12px", fill: "#64748b" }}
                    tick={{ textAnchor: "end" }}
                  />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      value,
                      name === "percentage" ? "Percentage %" : "Frequency",
                    ]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="frequency"
                    fill="#8b5cf6"
                    radius={[0, 4, 4, 0]}
                    name="Frequency"
                  />
                  <Bar
                    dataKey="percentage"
                    fill="#6366f1"
                    radius={[0, 4, 4, 0]}
                    name="Percentage %"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b py-4">
          <h3 className="text-xl font-semibold text-gray-900">Description</h3>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
            {data.test_results.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WordFrequencyAnalysisComponent;
