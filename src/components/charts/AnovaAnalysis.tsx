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
  [key: string]: number | string[];
}

interface PlotData {
  [key: string]: number | string;
}

interface TestData {
  table_data: TableData;
  plot_data: PlotData;
  plot_names: string[];
  plot_urls: string[];
  description: string;
}

interface TestResult {
  [key: string]: TestData;
}

interface TestProps {
  test_name: string;
  test_results: {
    results: TestResult[];
    description: string;
  };
}

const AnovaAnalysisComponent: React.FC<TestProps> = (props) => {
  const [selectedResult, setSelectedResult] = useState<string>(
    Object.keys(props.test_results.results[0])[0]
  );

  const currentResult = props.test_results.results.find(
    (result) => Object.keys(result)[0] === selectedResult
  )?.[selectedResult];

  const formatKey = (key: string) => {
    return key
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

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

  const renderTableData = (tableData: TableData) => {
    return Object.entries(tableData)
      .map(([key, value]) => {
        if (Array.isArray(value)) return null; // Skip arrays like interpretation
        return (
          <tr key={key} className="border-b">
            <td className="py-2">{formatKey(key)}</td>
            <td className="text-right py-2">
              {typeof value === "number" ? value.toFixed(4) : value}
            </td>
          </tr>
        );
      })
      .filter(Boolean); // Remove null entries
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
                {props.test_results.results.map((result) => {
                  const key = Object.keys(result)[0];
                  return (
                    <SelectItem key={key} value={key}>
                      {formatKey(key)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentResult ? (
            <div className="p-4">
              <p>No data available for this selection.</p>
            </div>
          ) : (
            <>
              {/* Statistical Values Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Statistic</th>
                      <th className="text-right py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>{renderTableData(currentResult.table_data)}</tbody>
                </table>
              </div>

              {/* Plot Images */}
              <div className="w-full">
                {currentResult.plot_urls?.map((url: string, index: number) => (
                  <div key={url} className="relative w-full">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-center font-medium">
                        {formatKey(currentResult.plot_names[index])}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleImageDownload(
                            url,
                            currentResult.plot_names[index]
                          )
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
            </>
          )}
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

export default AnovaAnalysisComponent;
