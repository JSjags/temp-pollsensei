import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon, Download } from "lucide-react";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";

interface DistributionData {
  min: number;
  quartile_1: number;
  quartile_3: number;
  max: number;
  mean: number;
  median: number;
  distribution: number[];
}

interface PlotData {
  type: string;
  u_statistic: number;
  p_value: number;
  [key: string]: DistributionData | string | number;
}

interface TableData {
  u_statistic: number;
  p_value: number;
  [key: string]: number;
}

interface ErrorResult {
  status: string;
  reason: string;
}

interface TestResult {
  [key: string]:
    | {
        table_data: TableData;
        plot_data: PlotData;
      }
    | ErrorResult;
}

interface TestProps {
  test_name: string;
  test_results: {
    results: TestResult[];
    description: string;
  };
}

const MannWhitneyUComponent: React.FC<{ data: TestProps }> = ({ data }) => {
  const [selectedComparison, setSelectedComparison] = useState<string>(
    Object.keys(data.test_results.results[0])[0]
  );

  const selectedResult = data.test_results.results.find(
    (result) => Object.keys(result)[0] === selectedComparison
  )?.[selectedComparison];

  const validResults = data.test_results.results.filter((result) => {
    const value = Object.values(result)[0];
    return !("status" in value && value.status === "error");
  });

  const hasValidResults = validResults.length > 0;

  if (!hasValidResults) {
    return (
      <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          {data.test_name}
        </h2>

        <Card>
          <CardHeader className="bg-gray-50 border-b py-4">
            <h3 className="text-xl font-semibold text-gray-900">
              Test Results Unavailable
            </h3>
          </CardHeader>
          <CardContent className="p-6">
            <Alert className="bg-amber-50 border-amber-200">
              <InfoIcon className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800">
                The test could not be completed for the following reasons:
              </AlertDescription>
            </Alert>
            <div className="mt-4 space-y-2">
              {data.test_results.results.map((result, index) => {
                const [comparison, details] = Object.entries(result)[0];
                if ("status" in details && details.status === "error") {
                  return (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <p className="font-medium text-gray-700">
                        {comparison
                          .split("-")
                          .join(" vs ")
                          .split("_")
                          .join(" ")}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {details.reason}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>

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
  }

  const formatPValue = (p: number) => {
    return p < 0.001 ? "< 0.001" : p.toFixed(4);
  };

  const ViolinPlot: React.FC<{ plotData: PlotData }> = ({ plotData }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
      const updateDimensions = () => {
        if (containerRef.current) {
          const { width } = containerRef.current.getBoundingClientRect();
          setDimensions({
            width: width,
            height: Math.min(500, width * 0.6),
          });
        }
      };

      updateDimensions();
      window.addEventListener("resize", updateDimensions);
      return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
      if (!dimensions.width || !svgRef.current) return;

      const margin = { top: 20, right: 30, bottom: 40, left: 60 };
      const width = dimensions.width - margin.left - margin.right;
      const height = dimensions.height - margin.top - margin.bottom;

      // Clear previous content
      d3.select(svgRef.current).selectAll("*").remove();

      // Create the SVG container
      const svg = d3
        .select(svgRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Get the distribution data for both groups
      const groups = Object.entries(plotData).filter(
        ([key, value]) => typeof value === "object" && "distribution" in value
      ) as [string, DistributionData][];

      // Calculate scales
      const categories = groups.map(([category]) => category);
      const xScale = d3
        .scaleBand()
        .range([0, width])
        .domain(categories)
        .padding(0.2);

      const allValues = groups.flatMap(([_, data]) => data.distribution);
      const yScale = d3
        .scaleLinear()
        .domain([d3.min(allValues) || 0, d3.max(allValues) || 0])
        .range([height, 0])
        .nice();

      // Create kernel density estimator
      const kde = (
        kernel: (v: number) => number,
        thresholds: number[],
        data: number[]
      ) => {
        return thresholds.map((t) => [
          t,
          d3.mean(data, (d) => kernel(t - d)) || 0,
        ]);
      };

      // Generate violin paths for each group
      groups.forEach(([category, data], i) => {
        const values = data.distribution;
        const thresholds = d3.range(
          data.min,
          data.max + 0.1,
          (data.max - data.min) / 20
        );

        const density = kde(
          (v) => Math.exp(-0.5 * (v * v)),
          thresholds,
          values
        );

        const xMax = d3.max(density, (d) => d[1]) || 0;
        const violinWidth = xScale.bandwidth();

        const violinScale = d3
          .scaleLinear()
          .domain([-xMax, xMax])
          .range([0, violinWidth]);

        const area = d3
          .area<[number, number]>()
          .x0((d) => violinScale(-d[1]))
          .x1((d) => violinScale(d[1]))
          .y((d) => yScale(d[0]))
          .curve(d3.curveCatmullRom);

        const violinPath = [
          ...density,
          ...density.map((d) => [d[0], -d[1]] as [number, number]).reverse(),
        ];

        // Draw violin
        svg
          .append("path")
          .datum(violinPath)
          .attr("transform", `translate(${xScale(category)},0)`)
          .attr("fill", i === 0 ? "#8b5cf6" : "#6366f1")
          .attr("opacity", 0.7)
          .attr("d", area as any);

        // Add quartiles
        const quartilesGroup = svg
          .append("g")
          .attr("transform", `translate(${xScale(category)},0)`);

        // Add median line
        quartilesGroup
          .append("line")
          .attr("x1", violinWidth * 0.25)
          .attr("x2", violinWidth * 0.75)
          .attr("y1", yScale(data.median))
          .attr("y2", yScale(data.median))
          .attr("stroke", "white")
          .attr("stroke-width", 2);

        // Add mean point
        quartilesGroup
          .append("circle")
          .attr("cx", violinWidth / 2)
          .attr("cy", yScale(data.mean))
          .attr("r", 4)
          .attr("fill", "white")
          .attr("stroke", i === 0 ? "#8b5cf6" : "#6366f1")
          .attr("stroke-width", 2);
      });

      // Add axes
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text((d) => (d as string).split("_").join(" "));

      svg
        .append("g")
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "12px");
    }, [plotData, dimensions]);

    const downloadPlot = () => {
      if (svgRef.current) {
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const downloadUrl = URL.createObjectURL(svgBlob);

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "mann-whitney-plot.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }
    };

    return (
      <div ref={containerRef} className="w-full">
        <div className="flex justify-end mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPlot}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
        <svg ref={svgRef} className="w-full" />
      </div>
    );
  };

  const isValidTestResult = (
    result: { table_data: TableData; plot_data: PlotData } | ErrorResult
  ): result is { table_data: TableData; plot_data: PlotData } => {
    return !("status" in result);
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        {data.test_name}
      </h2>

      <Select
        onValueChange={setSelectedComparison}
        defaultValue={selectedComparison}
      >
        <SelectTrigger className="w-full md:w-80">
          <SelectValue placeholder="Select Comparison" />
        </SelectTrigger>
        <SelectContent>
          {data.test_results.results.map((result) => {
            const comparison = Object.keys(result)[0];
            return (
              <SelectItem key={comparison} value={comparison}>
                {comparison.split("-").join(" vs ").split("_").join(" ")}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {selectedResult && isValidTestResult(selectedResult) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Card>
              <CardHeader className="bg-gray-50 border-b py-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Test Statistics
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600">U Statistic</div>
                    <div className="text-2xl font-bold">
                      {selectedResult.table_data.u_statistic.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">P-Value</div>
                    <div className="text-2xl font-bold">
                      {formatPValue(selectedResult.table_data.p_value)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-50 border-b py-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Significance
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <Alert
                  className={
                    selectedResult.table_data.p_value < 0.05
                      ? "bg-green-50"
                      : "bg-blue-50"
                  }
                >
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    {selectedResult.table_data.p_value < 0.05
                      ? "There is a significant difference between the groups"
                      : "There is no significant difference between the groups"}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gray-50 border-b py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Distribution Comparison
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[400px]">
                <ViolinPlot plotData={selectedResult.plot_data} />
              </div>
            </CardContent>
          </Card>
        </>
      )}

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

export default MannWhitneyUComponent;
