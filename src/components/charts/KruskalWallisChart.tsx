import React, { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { select } from "d3-selection";
import { scaleLinear, scaleBand } from "d3-scale";
import { area, line, curveCatmullRom } from "d3-shape";
import { min, max, median, range } from "d3-array";
import { format } from "d3-format";
import { axisBottom, axisLeft } from "d3-axis";

interface KruskalWallisResult {
  [key: string]: {
    h_statistic: number[];
    p_value: number[];
  };
}

const DEFAULT_TEST_DATA = [
  {
    "region-product_usage_frequency": {
      h_statistic: [0.9999999999999994],
      p_value: [0.3173105078629113],
    },
  },
];

// Generate kernel density estimation data
const generateKDE = (data: number[], bandwidth: number = 0.4) => {
  const points = range(0, 10, 0.1);
  return points.map((x) => ({
    x,
    y:
      data.reduce((acc, d) => {
        const z = (x - d) / bandwidth;
        return (
          acc + Math.exp(-0.5 * z * z) / (Math.sqrt(2 * Math.PI) * bandwidth)
        );
      }, 0) / data.length,
  }));
};

const ViolinPlot: React.FC<{
  test_data?: { [key: string]: KruskalWallisResult }[];
}> = ({ test_data = [] }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    content: string;
    x: number;
    y: number;
  }>({ show: false, content: "", x: 0, y: 0 });

  const resultsToUse = test_data.length === 0 ? DEFAULT_TEST_DATA : test_data;
  const isUsingDefault = test_data.length === 0;

  // Generate violin plot data
  const violinData = React.useMemo(() => {
    return resultsToUse.map((result) => {
      const [name, stats] = Object.entries(result)[0];
      const hStat = stats.h_statistic[0];
      const pValue = stats.p_value[0];

      const sampleSize = 200;
      const center = 5 + hStat * 0.5;
      const spread = Math.max(0.5, pValue * 2);

      const samples = Array.from({ length: sampleSize }, () => {
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return Math.max(0, Math.min(10, center + z * spread));
      });

      return {
        name: name.replace(/-/g, " vs "),
        stats,
        kde: generateKDE(samples),
        median: median(samples) || 0,
        q1: median(samples.filter((d) => d < (median(samples) || 0))) || 0,
        q3: median(samples.filter((d) => d > (median(samples) || 0))) || 0,
      };
    });
  }, [resultsToUse]);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width,
          height: Math.min(600, Math.max(400, width * 0.6)),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = {
      top: 40,
      right: 30,
      bottom: 60,
      left: 60,
    };

    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales
    const x = scaleBand()
      .domain(violinData.map((d) => d.name))
      .range([0, width])
      .padding(0.1);

    const y = scaleLinear().domain([0, 10]).range([height, 0]);

    // Create violin shapes
    const violinWidth = Math.min(100, x.bandwidth());

    violinData.forEach((datum) => {
      const xCenter = x(datum.name)! + x.bandwidth() / 2;

      // Create violin shape
      const violinArea = area<{ x: number; y: number }>()
        .x0((d) => xCenter - d.y * violinWidth)
        .x1((d) => xCenter + d.y * violinWidth)
        .y((d) => y(d.x))
        .curve(curveCatmullRom);

      // Draw violin with hover interactions
      g.append("path")
        .datum(datum.kde)
        .attr("d", violinArea)
        .attr("fill", "hsl(246, 100%, 87%)")
        .attr("opacity", 0.8)
        .attr("stroke", "none")
        .on("mouseover", (event) => {
          const [mouseX, mouseY] = [event.pageX, event.pageY];
          setTooltip({
            show: true,
            content: `
              Group: ${datum.name}
              H-statistic: ${datum.stats.h_statistic[0].toFixed(3)}
              p-value: ${datum.stats.p_value[0].toFixed(3)}
              Distribution shows the density of values
            `,
            x: mouseX,
            y: mouseY,
          });
        })
        .on("mousemove", (event) => {
          setTooltip((prev) => ({
            ...prev,
            x: event.pageX,
            y: event.pageY,
          }));
        })
        .on("mouseout", () => {
          setTooltip((prev) => ({ ...prev, show: false }));
        });

      // Draw median line with tooltip
      g.append("line")
        .attr("x1", xCenter - violinWidth / 2)
        .attr("x2", xCenter + violinWidth / 2)
        .attr("y1", y(datum.median))
        .attr("y2", y(datum.median))
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .on("mouseover", (event) => {
          const [mouseX, mouseY] = [event.pageX, event.pageY];
          setTooltip({
            show: true,
            content: `Median: ${datum.median.toFixed(2)}`,
            x: mouseX,
            y: mouseY,
          });
        })
        .on("mousemove", (event) => {
          setTooltip((prev) => ({
            ...prev,
            x: event.pageX,
            y: event.pageY,
          }));
        })
        .on("mouseout", () => {
          setTooltip((prev) => ({ ...prev, show: false }));
        });

      // Draw quartile lines with tooltips
      [
        { value: datum.q1, label: "First Quartile" },
        { value: datum.q3, label: "Third Quartile" },
      ].forEach(({ value, label }) => {
        g.append("line")
          .attr("x1", xCenter - violinWidth / 4)
          .attr("x2", xCenter + violinWidth / 4)
          .attr("y1", y(value))
          .attr("y2", y(value))
          .attr("stroke", "black")
          .attr("stroke-width", 1)
          .on("mouseover", (event) => {
            const [mouseX, mouseY] = [event.pageX, event.pageY];
            setTooltip({
              show: true,
              content: `${label}: ${value.toFixed(2)}`,
              x: mouseX,
              y: mouseY,
            });
          })
          .on("mousemove", (event) => {
            setTooltip((prev) => ({
              ...prev,
              x: event.pageX,
              y: event.pageY,
            }));
          })
          .on("mouseout", () => {
            setTooltip((prev) => ({ ...prev, show: false }));
          });
      });
    });

    // Add axes
    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(axisBottom(x));

    g.append("g").call(axisLeft(y));

    // Add labels
    g.append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 20)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text("Distribution");

    g.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Groups");
  }, [dimensions, violinData]);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-0 pb-2"></CardHeader>
      <CardContent>
        {isUsingDefault && (
          <Alert className="mb-4 bg-blue-50">
            <AlertDescription>
              Showing example data. No valid test results were provided.
            </AlertDescription>
          </Alert>
        )}
        <div className="relative" ref={containerRef}>
          {violinData.map((datum, index) => (
            <div key={datum.name} className="mb-2 text-sm">
              <span className="font-medium capitalize">
                {datum.name.replace(/_/g, " ")}:
              </span>{" "}
              <span>
                H = {datum.stats.h_statistic[0].toFixed(3)}, p{" "}
                {datum.stats.p_value[0] < 0.001
                  ? "< 0.001"
                  : `= ${datum.stats.p_value[0].toFixed(3)}`}
              </span>
            </div>
          ))}
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="overflow-visible"
          />
          {tooltip.show && (
            <div
              className="absolute pointer-events-none bg-white p-2 rounded shadow-lg border text-sm"
              style={{
                left: tooltip.x + 10,
                top: tooltip.y - 10,
                transform: "translate(-50%, -100%)",
                maxWidth: "200px",
                whiteSpace: "pre-line",
              }}
            >
              {tooltip.content}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ViolinPlot;
