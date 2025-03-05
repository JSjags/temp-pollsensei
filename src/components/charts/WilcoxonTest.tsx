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

interface TestData {
  table_data: {
    statistics: string[];
    value: number[];
  };
  plot_names: string[];
  plot_urls: string[];
}

interface TestProps {
  test_name: string;
  test_results: {
    results: Record<string, TestData>;
    description: string;
  };
}

const WilcoxonTestComponent: React.FC<TestProps> = (props) => {
  const [selectedResult, setSelectedResult] = useState<string>(
    Object.keys(props.test_results.results)[0]
  );

  const currentResult = props.test_results.results[selectedResult];

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{props.test_name}</span>
            <Select value={selectedResult} onValueChange={setSelectedResult}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select variable" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(props.test_results.results).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l: string) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!currentResult || !currentResult.table_data ? (
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
                  <tbody>
                    {currentResult.table_data.statistics?.map(
                      (stat: string, index: number) => (
                        <tr key={stat} className="border-b">
                          <td className="py-2">{stat}</td>
                          <td className="text-right py-2">
                            {currentResult.table_data.value[index]?.toFixed(
                              3
                            ) ?? "N/A"}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>

              {/* Plot Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentResult.plot_urls?.map((url: string, index: number) => (
                  <div key={url} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-center font-medium">
                        {currentResult.plot_names[index]
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (l: string) => l.toUpperCase())}
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
          <p className="text-gray-700">{props.test_results.description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WilcoxonTestComponent;
