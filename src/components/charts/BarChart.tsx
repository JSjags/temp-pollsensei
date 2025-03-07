import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    labels: string[]; // Labels for the x-axis (e.g., Yes/No)
    datasets: {
      label?: string; // Label for the dataset
      data: number[]; // Data values for the dataset
      backgroundColor: string[]; // Colors for each bar
    }[];
  };
  title: string; // Optional title for the chart
  showLegend?: boolean; // Whether or not to show the legend
  question: string;
  allowDownload?: boolean;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  showLegend = false,
  question,
  allowDownload = false,
}) => {
  const chartRef = useRef<any>(null);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: showLegend,
      },
    },
    scales: {
      x: {
        ticks: {
          display: true,
        },
      },
      y: {
        ticks: {
          display: true,
        },
      },
    },
    barThickness: 40,
    maxBarThickness: 50,
  };

  const downloadChart = () => {
    if (chartRef.current) {
      // Create a temporary container div
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      // Create a new canvas for the complete image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions
      canvas.width = 800;
      canvas.height = 600;

      if (ctx) {
        // Fill white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add title
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(title, 40, 40);

        // Add question
        ctx.font = "16px Arial";
        ctx.fillText(question, 40, 70);

        // Add chart
        const chartCanvas = chartRef.current.canvas;
        ctx.drawImage(chartCanvas, 40, 100, 720, 400);

        // Add legend
        let legendY = 520;
        data.labels.forEach((label, index) => {
          // Draw color box
          ctx.fillStyle = data.datasets[0].backgroundColor[index];
          ctx.fillRect(40, legendY - 10, 15, 15);

          // Draw label text
          ctx.fillStyle = "black";
          ctx.font = "14px Arial";
          ctx.fillText(
            `${label}: ${data.datasets[0].data[index].toFixed(2)}%`,
            65,
            legendY
          );

          legendY += 25;
        });

        // Create download link
        const link = document.createElement("a");
        link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }

      // Cleanup
      document.body.removeChild(container);
    }
  };

  return (
    <div className="border mt-4 w-full rounded-lg shadow-md p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
        {allowDownload && (
          <Button onClick={downloadChart} variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
      <p className="text-gray-600 mb-4">{question}</p>
      <div className="flex items-start">
        <div className="flex flex-1 flex-col justify-around mt-4">
          {data.labels.map((label, index) => (
            <div key={label} className="flex items-center space-x-2">
              <span
                className={`inline-block w-3 h-3 rounded-full`}
                style={{
                  backgroundColor: data.datasets[0].backgroundColor[index],
                }}
              ></span>
              <span className="text-gray-700 font-bold">
                {label} :{" "}
                <span className="ml-5">
                  {data.datasets[0].data[index]?.toFixed(2)}%
                </span>
              </span>
            </div>
          ))}
        </div>
        <div className="h-56 flex-1 w-full">
          <Bar
            ref={chartRef}
            data={data}
            options={options}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default BarChart;
