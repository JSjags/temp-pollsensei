import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import jStat from "jstat";

interface TestResult {
  statistic: number;
  p_value: number;
  dof: number;
}

interface PlotData {
  variable: string;
  distribution: number[];
  expected_frequency: number[];
}

interface TestProps {
  test_name: string;
  test_results: {
    results: Record<string, { table_data: TestResult; plot_data: PlotData }>;
    description: string;
  };
}

const ChiSquareComponent: React.FC<{ data: TestProps }> = ({ data }) => {
  const [selectedVariable, setSelectedVariable] = useState<string>(
    Object.keys(data.test_results.results)[0]
  );
  const selectedResult = data.test_results.results[selectedVariable];
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || !selectedResult) return;

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = 600;
    const height = 400;
    const margin = { top: 40, right: 40, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate Chi-Square distribution points
    const dof = selectedResult.table_data.dof;
    const criticalValue = jStat.chisquare.inv(0.95, dof); // 95% confidence level
    const maxX = Math.max(
      selectedResult.table_data.statistic * 1.5,
      criticalValue * 1.5
    );

    const x = d3.scaleLinear().domain([0, maxX]).range([0, innerWidth]);

    // Generate chi-square distribution points
    const points: [number, number][] = [];
    const dx = maxX / 200; // 200 points for smooth curve
    for (let i = 0; i <= 200; i++) {
      const x_val = i * dx;
      const density = jStat.chisquare.pdf(x_val, dof);
      points.push([x_val, density]);
    }

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(points, (d) => d[1]) || 0])
      .nice()
      .range([innerHeight, 0]);

    // Add area under curve
    const area = d3
      .area<[number, number]>()
      .x((d) => x(d[0]))
      .y0(innerHeight)
      .y1((d) => y(d[1]))
      .curve(d3.curveBasis);

    // Add shaded area for p-value region
    const pValuePoints = points.filter(
      (p) => p[0] >= selectedResult.table_data.statistic
    );
    g.append("path")
      .datum(pValuePoints)
      .attr("fill", "rgba(156, 163, 175, 0.2)")
      .attr("d", area);

    // Add the distribution curve
    g.append("path")
      .datum(points)
      .attr("fill", "none")
      .attr("stroke", "#8b5cf6")
      .attr("stroke-width", 2)
      .attr(
        "d",
        d3
          .line<[number, number]>()
          .x((d) => x(d[0]))
          .y((d) => y(d[1]))
          .curve(d3.curveBasis)
      );

    // Add critical value line
    g.append("line")
      .attr("x1", x(criticalValue))
      .attr("x2", x(criticalValue))
      .attr("y1", innerHeight)
      .attr("y2", 0)
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4");

    // Add test statistic line
    g.append("line")
      .attr("x1", x(selectedResult.table_data.statistic))
      .attr("x2", x(selectedResult.table_data.statistic))
      .attr("y1", innerHeight)
      .attr("y2", 0)
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2);

    // Add legend
    const legend = g
      .append("g")
      .attr("transform", `translate(${innerWidth - 200}, 20)`);

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", -5)
      .attr("fill", "#374151")
      .attr("font-size", "12px")
      .text(`χ² (df=${dof})`);

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", 15)
      .attr("fill", "#ef4444")
      .attr("font-size", "12px")
      .text(`Critical Value = ${criticalValue.toFixed(2)}`);

    legend
      .append("text")
      .attr("x", 0)
      .attr("y", 35)
      .attr("fill", "#22c55e")
      .attr("font-size", "12px")
      .text(
        `Test Statistic = ${selectedResult.table_data.statistic.toFixed(2)}`
      );

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .call((g) => g.select(".domain").attr("stroke", "#64748b"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#64748b"))
      .call((g) => g.selectAll(".tick text").attr("fill", "#64748b"));

    g.append("g")
      .call(d3.axisLeft(y))
      .call((g) => g.select(".domain").attr("stroke", "#64748b"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#64748b"))
      .call((g) => g.selectAll(".tick text").attr("fill", "#64748b"));

    // Add labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 40)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .text("Chi-Square Value");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -40)
      .attr("text-anchor", "middle")
      .attr("fill", "#64748b")
      .text("Density");
  }, [selectedVariable, selectedResult]);

  function kernelDensityEstimator(kernel: (v: number) => number, X: number[]) {
    return function (V: number[]): [number, number][] {
      return X.map((x) => [x, d3.mean(V, (v) => kernel(x - v)) || 0]);
    };
  }

  function kernelEpanechnikov(k: number) {
    return function (v: number) {
      return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
    };
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900">{data.test_name}</h2>
      <Select
        onValueChange={setSelectedVariable}
        defaultValue={selectedVariable}
      >
        <SelectTrigger className="w-full md:w-72">
          <SelectValue placeholder="Select Variable" />
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
            Chi-Square Distribution with Test Statistic and Critical Value
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <svg
            ref={chartRef}
            width={600}
            height={400}
            className="w-full h-auto"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Statistical Values
          </h3>
        </CardHeader>
        <CardContent className="p-6">
          <table className="w-full border-collapse">
            <tbody>
              {Object.entries(selectedResult.table_data).map(([key, value]) => (
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
                    {typeof value === "number" ? value.toFixed(4) : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ChiSquareComponent;
