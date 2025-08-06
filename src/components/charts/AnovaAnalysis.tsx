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
  statistics: string[];
  value: (number | string)[];
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
  // Filter out empty result objects
  const validResults = props.test_results.results.filter(
    (result) => Object.keys(result).length > 0
  );

  // Check if there are any valid results
  const hasResults = validResults.length > 0;

  // Set initial selectedResult to the first valid result key, if any
  const [selectedResult, setSelectedResult] = useState<string>(
    hasResults ? Object.keys(validResults[0])[0] : ""
  );

  // Find the current result from validResults
  const currentResult = hasResults
    ? validResults.find(
        (result) => Object.keys(result)[0] === selectedResult
      )?.[selectedResult]
    : null;

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
    return tableData.statistics.map((statistic, index) => (
      <tr key={statistic} className="border-b">
        <td className="py-2">{statistic}</td>
        <td className="text-right py-2">
          {typeof tableData.value[index] === "number"
            ? Number(tableData.value[index]).toFixed(4)
            : tableData.value[index]}
        </td>
      </tr>
    ));
  };

  // If no results, show a message
  if (!hasResults) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{props.test_name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                No test results available. The test could not be performed due
                to insufficient data.
              </p>
              {props.test_results.description && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Test Information:
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {extractDescription(props.test_results.description)}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{props.test_name}</span>
            {validResults.length > 0 ? (
              <Select value={selectedResult} onValueChange={setSelectedResult}>
                <SelectTrigger className="w-[200px] h-auto min-h-[40px]">
                  <SelectValue placeholder="Select variables" />
                </SelectTrigger>
                <SelectContent>
                  {validResults.map((result) => {
                    const key = Object.keys(result)[0];
                    return (
                      <SelectItem key={key} value={key}>
                        {formatKey(key)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            ) : null}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {validResults.length === 0 ? (
            <div className="p-4">
              <p>No valid results available for this analysis.</p>
            </div>
          ) : !currentResult ? (
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
              {currentResult.plot_urls &&
                currentResult.plot_urls.length > 0 && (
                  <div className="w-full">
                    {currentResult.plot_urls.map(
                      (url: string, index: number) => (
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
                      )
                    )}
                  </div>
                )}
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
