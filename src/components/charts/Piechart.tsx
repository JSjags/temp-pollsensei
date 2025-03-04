import React, { useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      backgroundColor: string[];
    }[];
  };
  title: string;
  question: string;
  allowDownload?: boolean;
}

const Piechart: React.FC<PieChartProps> = ({
  data,
  title,
  question,
  allowDownload = false,
}) => {
  const chartRef = useRef<any>(null);

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    aspectRatio: 1,
    maintainAspectRatio: true,
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
    <div className="border rounded-lg shadow-md p-6 bg-white mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
        {allowDownload && (
          <button
            onClick={downloadChart}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Download Chart
          </button>
        )}
      </div>
      <p className="text-gray-600 mb-4">{question}</p>

      <div className="flex flex-col md:flex-row justify-between gap-5 items-center">
        <div className="w-full md:w-1/2 flex flex-col gap-3">
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
        <div className="w-full md:w-1/2 h-[300px] flex items-center justify-center">
          <Doughnut ref={chartRef} data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Piechart;
