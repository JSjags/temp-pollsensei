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

interface DescriptiveStats {
  Group: string;
  Count: number;
  Median: number;
  Mean: number;
  Min: number;
  Max: number;
  IQR: number;
  "Median Rank": number;
}

interface TableData {
  statistics: string[];
  value: number[];
  interpretation?: Record<string, string>;
}

interface PostHocTest {
  Comparison: string;
  "Adjusted p-value": number;
  Significant: boolean;
}

interface PlotData {
  type: string;
  h_statistic: number;
  p_value: number;
  groups: string[];
  data: number[][];
  median_ranks: Array<{
    group: string;
    median_rank: number;
  }>;
  [key: string]: any;
}

interface TestData {
  descriptive_stats: DescriptiveStats[];
  table_data: TableData;
  post_hoc: PostHocTest[];
  plot_data: PlotData;
  plot_names: string[];
  plot_urls: string[];
  description: string;
  status?: string;
  reason?: string;
}

interface TestProps {
  test_name: string;
  test_results: {
    results: Array<Record<string, TestData>>;
    description: string;
  };
  ft_explanation?: string;
}

const KruskalWallisComponent: React.FC<TestProps> = (props) => {
  // Check if there are any results
  const hasResults =
    props.test_results.results.length > 0 &&
    props.test_results.results.some((result) => Object.keys(result).length > 0);

  const [selectedResult, setSelectedResult] = useState<string>(
    hasResults ? Object.keys(props.test_results.results[0])[0] : ""
  );

  const currentResult = hasResults
    ? props.test_results.results[0][selectedResult]
    : null;

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

  const getAvailableResults = () => {
    return props.test_results.results.flatMap((result) => Object.keys(result));
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
            <Select value={selectedResult} onValueChange={setSelectedResult}>
              <SelectTrigger className="w-[200px] h-auto min-h-[40px]">
                <SelectValue placeholder="Select variable" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableResults().map((key) => (
                  <SelectItem key={key} value={key}>
                    {key.split("-").map(formatKey).join(" vs ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentResult?.status === "error" ? (
            <div className="p-4 text-red-500">
              Error: {currentResult.reason}
            </div>
          ) : !currentResult ? (
            <div className="p-4">
              <p>No data available for this selection.</p>
            </div>
          ) : (
            <>
              {/* Descriptive Statistics Table */}
              {currentResult.descriptive_stats && (
                <div className="overflow-x-auto">
                  <h3 className="text-lg font-medium mb-2">
                    Descriptive Statistics
                  </h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Group</th>
                        <th className="text-right py-2">Count</th>
                        <th className="text-right py-2">Median</th>
                        <th className="text-right py-2">Mean</th>
                        <th className="text-right py-2">Min</th>
                        <th className="text-right py-2">Max</th>
                        <th className="text-right py-2">IQR</th>
                        <th className="text-right py-2">Median Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentResult.descriptive_stats.map((stat) => (
                        <tr key={stat.Group} className="border-b">
                          <td className="py-2">{formatKey(stat.Group)}</td>
                          <td className="text-right py-2">{stat.Count}</td>
                          <td className="text-right py-2">{stat.Median}</td>
                          <td className="text-right py-2">
                            {stat.Mean.toFixed(2)}
                          </td>
                          <td className="text-right py-2">{stat.Min}</td>
                          <td className="text-right py-2">{stat.Max}</td>
                          <td className="text-right py-2">{stat.IQR}</td>
                          <td className="text-right py-2">
                            {stat["Median Rank"]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Statistical Values Table */}
              <div className="overflow-x-auto">
                <h3 className="text-lg font-medium mb-2">Test Statistics</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Statistic</th>
                      <th className="text-right py-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentResult.table_data?.statistics.map(
                      (statistic, index) => (
                        <tr key={statistic} className="border-b">
                          <td className="py-2">{statistic}</td>
                          <td className="text-right py-2">
                            {typeof currentResult.table_data.value[index] ===
                            "number"
                              ? currentResult.table_data.value[index].toFixed(4)
                              : "N/A"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Post Hoc Tests Table */}
              {currentResult.post_hoc && currentResult.post_hoc.length > 0 && (
                <div className="overflow-x-auto mt-4">
                  <h3 className="text-lg font-medium mb-2">Post Hoc Tests</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Comparison</th>
                        <th className="text-right py-2">Adjusted p-value</th>
                        <th className="text-center py-2">Significant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentResult.post_hoc.map((test, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">
                            {test.Comparison.split(" vs ")
                              .map(formatKey)
                              .join(" vs ")}
                          </td>
                          <td className="text-right py-2">
                            {test["Adjusted p-value"].toFixed(4)}
                          </td>
                          <td className="text-center py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                test.Significant
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {test.Significant ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Median Ranks Table */}
              {currentResult.plot_data?.median_ranks && (
                <div className="overflow-x-auto mt-4">
                  <h3 className="text-lg font-medium mb-2">Median Ranks</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Group</th>
                        <th className="text-right py-2">Median Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentResult.plot_data.median_ranks.map((rankData) => (
                        <tr key={rankData.group} className="border-b">
                          <td className="py-2">{formatKey(rankData.group)}</td>
                          <td className="text-right py-2">
                            {rankData.median_rank.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Plot Images */}
              {currentResult.plot_urls &&
                currentResult.plot_urls.length > 0 && (
                  <div
                    className={`grid ${
                      currentResult.plot_urls.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-1 md:grid-cols-2"
                    } gap-4`}
                  >
                    {currentResult.plot_urls.map(
                      (url: string, index: number) => (
                        <div key={url} className="relative">
                          <div className="flex justify-between items-center mb-2">
                            <div className="text-center font-medium">
                              {currentResult.plot_names[index]
                                .split("_")
                                .map(formatKey)
                                .join(" ")}
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

export default KruskalWallisComponent;
