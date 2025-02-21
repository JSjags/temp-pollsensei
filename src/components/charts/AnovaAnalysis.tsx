import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import * as d3 from "d3";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlotData {
  type: string;
  f_statistic: number;
  p_value: number;
  [key: string]: any; // For dynamic mean and std values
}

interface TableData {
  f_statistic: number;
  p_value: number;
  [key: string]: number; // For squares sums and mean squares
}

interface ResultItem {
  [key: string]: {
    table_data: TableData;
    plot_data: PlotData;
  };
}

interface AnovaProps {
  data: {
    test_name: string;
    test_results: {
      results: ResultItem[];
      description: string;
    };
  };
}

const AnovaAnalysis: React.FC<AnovaProps> = ({ data }) => {
  const chartRef = useRef<SVGSVGElement>(null);
  const [selectedResult, setSelectedResult] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Validate data structure
  if (!data?.test_results?.results?.length) {
    return (
      <Alert>
        <AlertDescription>
          No ANOVA data available for visualization
        </AlertDescription>
      </Alert>
    );
  }

  // Get all available comparisons for the dropdown with safe access
  const comparisons = data.test_results.results.map((result, index) => {
    try {
      const key = Object.keys(result)[0] || "Unknown Comparison";
      return {
        label: key
          .split("-")
          .map((text) =>
            text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          )
          .join(" vs "),
        value: index.toString(),
      };
    } catch (e) {
      return {
        label: `Comparison ${index + 1}`,
        value: index.toString(),
      };
    }
  });

  useEffect(() => {
    try {
      if (!data?.test_results?.results?.[selectedResult] || !chartRef.current) {
        setError("Invalid data or missing chart reference");
        return;
      }

      // Get the selected result for visualization with safe access
      const currentResult = Object.values(
        data.test_results.results[selectedResult]
      )[0];

      if (!currentResult?.plot_data) {
        setError("Missing plot data for selected comparison");
        return;
      }

      const plotData = currentResult.plot_data;

      // Extract means and standard deviations with validation
      const variables = Object.keys(plotData).filter(
        (key) => key.startsWith("mean_") && key !== "mean_squares"
      );

      if (!variables.length) {
        setError("No valid variables found for comparison");
        return;
      }

      const chartData = variables.map((key) => {
        const mean = plotData[key] ?? 0;
        const stdKey = `std_${key.replace("mean_", "")}`;
        const std = plotData[stdKey] ?? 0;
        return {
          name: key.replace("mean_", ""),
          mean,
          std,
        };
      });

      // Clear previous chart and error
      d3.select(chartRef.current).selectAll("*").remove();
      setError(null);

      // Set up dimensions
      const margin = { top: 40, right: 30, bottom: 60, left: 60 };
      const width = 800 - margin.left - margin.right;
      const height = 400 - margin.top - margin.bottom;

      // Create SVG
      const svg = d3
        .select(chartRef.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // Generate dynamic title based on variables
      const titleText = `Mean Comparison of ${variables
        .map((v) =>
          v
            .replace("mean_", "")
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
        )
        .join(" vs ")}`;

      // Add title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text(titleText);

      // Set up scales
      const x = d3
        .scaleBand()
        .range([0, width])
        .domain(chartData.map((d) => d.name))
        .padding(0.2);

      const confidenceLevel = 0.95; // 95% confidence interval
      const zScore = 1.96; // z-score for 95% CI
      const yMin = Math.min(...chartData.map((d) => d.mean - zScore * d.std));
      const yMax = Math.max(...chartData.map((d) => d.mean + zScore * d.std));
      const yPadding = (yMax - yMin) * 0.1; // Add 10% padding

      const y = d3
        .scaleLinear()
        .range([height, 0])
        .domain([yMin - yPadding, yMax + yPadding]);

      // Add axes
      svg
        .append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(0,10)")
        .text((d) =>
          (d as string)
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase())
        );

      svg.append("g").call(d3.axisLeft(y));

      // Add error bars and points
      chartData.forEach((d) => {
        const xPos = x(d.name)! + x.bandwidth() / 2;
        const yPos = y(d.mean);
        const ci = zScore * d.std; // Calculate confidence interval

        // Error bar vertical line
        svg
          .append("line")
          .attr("x1", xPos)
          .attr("x2", xPos)
          .attr("y1", y(d.mean - ci))
          .attr("y2", y(d.mean + ci))
          .attr("stroke", "blue")
          .attr("stroke-width", 2);

        // Error bar horizontal caps
        svg
          .append("line")
          .attr("x1", xPos - 5)
          .attr("x2", xPos + 5)
          .attr("y1", y(d.mean - ci))
          .attr("y2", y(d.mean - ci))
          .attr("stroke", "blue")
          .attr("stroke-width", 2);

        svg
          .append("line")
          .attr("x1", xPos - 5)
          .attr("x2", xPos + 5)
          .attr("y1", y(d.mean + ci))
          .attr("y2", y(d.mean + ci))
          .attr("stroke", "blue")
          .attr("stroke-width", 2);

        // Mean point
        svg
          .append("circle")
          .attr("cx", xPos)
          .attr("cy", yPos)
          .attr("r", 4)
          .attr("fill", "blue");
      });

      // Add legend with better positioning
      const legendGroup = svg
        .append("g")
        .attr("transform", `translate(${width - 250}, 10)`);

      // Add background rectangle for better visibility
      legendGroup
        .append("rect")
        .attr("x", -10)
        .attr("y", -20)
        .attr("width", 260)
        .attr("height", 40)
        .attr("fill", "white")
        .attr("stroke", "#e5e7eb")
        .attr("rx", 4);

      // Add legend point
      legendGroup
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 4)
        .style("fill", "blue");

      // Calculate confidence interval percentage and mean differences
      const ciPercentage = (confidenceLevel * 100).toFixed(0);
      const meanRange = chartData.map((d) => d.mean);
      const meanMin = Math.min(...meanRange);
      const meanMax = Math.max(...meanRange);
      const meanDiff = (meanMax - meanMin).toFixed(2);

      // Add legend text
      legendGroup
        .append("text")
        .attr("x", 10)
        .attr("y", 0)
        .text(`Mean ± ${ciPercentage}% CI (Diff: ${meanDiff})`)
        .style("font-size", "12px")
        .attr("alignment-baseline", "middle");

      // Add y-axis label with clearer positioning
      svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20) // Adjust position to be more visible
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .text("Mean Score");
    } catch (err) {
      console.error("Error creating ANOVA chart:", err);
      setError("Failed to create chart visualization");
    }
  }, [data, selectedResult]);

  // Safe access to current result
  const currentResult = Object.values(
    data.test_results.results[selectedResult] || {}
  )[0];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">{data.test_name}</h2>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Select
        value={selectedResult.toString()}
        onValueChange={(value) => setSelectedResult(parseInt(value))}
      >
        <SelectTrigger className="w-full md:w-72">
          <SelectValue placeholder="Select comparison" />
        </SelectTrigger>
        <SelectContent>
          {comparisons.map((comparison) => (
            <SelectItem key={comparison.value} value={comparison.value}>
              {comparison.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Mean Comparison with Confidence Intervals
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <svg
            ref={chartRef}
            width={800}
            height={400}
            className="w-full h-auto"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </CardContent>
      </Card>

      {currentResult && (
        <>
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Statistical Values
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(currentResult.table_data || {}).map(
                    ([key, value]) => (
                      <tr key={key} className="border-b border-gray-100">
                        <td className="px-4 py-3 font-medium text-gray-700">
                          {key
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase()
                            )
                            .join(" ")}
                        </td>
                        <td className="px-4 py-3 text-gray-900">
                          {typeof value === "number"
                            ? value.toLocaleString(undefined, {
                                minimumFractionDigits: 4,
                                maximumFractionDigits: 4,
                              })
                            : value || "N/A"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Description
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {data.test_results.description || "No description available"}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AnovaAnalysis;
