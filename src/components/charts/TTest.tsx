import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Image from "next/image";
import { extractDescription } from "@/utils/analysis";

interface TableData {
  t_statistic: number;
  p_value: number;
  mean_diff: number;
  interpretation: string[];
  [key: string]: any; // For SEM values that vary by variable name
}

interface PlotData {
  type: string;
  t_statistic: number;
  p_value: number;
  [key: string]: any; // For variable-specific data arrays
}

interface TestData {
  table_data: TableData;
  plot_data: PlotData;
  plot_names: string[];
  plot_urls: string[];
  description: string;
}

interface TestResults {
  [key: string]: TestData;
}

interface TestProps {
  test_name: string;
  test_results: {
    results: TestResults[];
    description: string;
  };
}

const TTest: React.FC<TestProps> = (props) => {
  // Flatten results array into a single object
  const flattenedResults = props.test_results.results.reduce(
    (acc, curr) => ({ ...acc, ...curr }),
    {}
  );

  const [selectedResult, setSelectedResult] = useState<string>(
    Object.keys(flattenedResults)[0]
  );

  const currentResult = flattenedResults[selectedResult];

  const handleImageDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${name.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const formatKey = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get SEM keys from table_data
  const getSEMKeys = () => {
    return Object.keys(currentResult.table_data).filter((key) =>
      key.endsWith("_sem")
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{props.test_name}</span>
            <Select value={selectedResult} onValueChange={setSelectedResult}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select variables" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(flattenedResults).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key.split("-").map(formatKey).join(" vs ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Statistical Values Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Statistic</th>
                  <th className="text-right py-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">T-Statistic</td>
                  <td className="text-right py-2">
                    {currentResult.table_data.t_statistic.toFixed(4)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">P-Value</td>
                  <td className="text-right py-2">
                    {currentResult.table_data.p_value.toFixed(4)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Mean Difference</td>
                  <td className="text-right py-2">
                    {currentResult.table_data.mean_diff.toFixed(4)}
                  </td>
                </tr>
                {/* Standard Error of Mean for each variable */}
                {getSEMKeys().map((key) => (
                  <tr key={key} className="border-b">
                    <td className="py-2">
                      {formatKey(key.replace("_sem", ""))} SEM
                    </td>
                    <td className="text-right py-2">
                      {currentResult.table_data[key].toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plot Images */}
          <div className="grid grid-cols-1 gap-4">
            {currentResult.plot_urls?.map((url: string, index: number) => (
              <div key={url} className="relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-center font-medium">Box Plot</div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleImageDownload(url, currentResult.plot_names[index])
                    }
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                </div>
                <div className="relative aspect-video mt-2">
                  <Image
                    src={url}
                    alt={currentResult.plot_names[index]}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analysis Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {currentResult?.description
              ? extractDescription(currentResult?.description)
              : props.test_results.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TTest;
