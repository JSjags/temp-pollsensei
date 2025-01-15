import React from "react";
import { Bubble } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Legend } from "chart.js";
import "chart.js/auto";

ChartJS.register(Tooltip, Legend);

const CreationMethodDistribution: React.FC = () => {
  const data = {
    datasets: [
      {
        label: "AI-Generated",
        data: [{ x: 1, y: 2, r: 50 }], // Size of bubble
        backgroundColor: "#6B21A8", // Deep purple
      },
      {
        label: "Manual",
        data: [{ x: 1.8, y: 1.8, r: 30 }], // Slight offset for overlapping
        backgroundColor: "#9333EA", // Light purple
      },
      {
        label: "Mixed",
        data: [{ x: 2.6, y: 2, r: 20 }], // Offset to match positioning
        backgroundColor: "#A855F7", // Blue-purple
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        enabled: false, // Disable tooltip for static text
      },
      legend: {
        display: false, // Hide legend
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="relative bg-white p-6 shadow-lg rounded-lg max-w-md mx-auto">
      {/* Title */}
      <h2 className="text-center text-lg font-semibold">Creation Method Distribution</h2>

      {/* Dropdown */}
      <div className="absolute top-4 right-4">
        <select className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-sm">
          <option>January</option>
        </select>
      </div>

      {/* Bubble Chart */}
      <div className="mt-6">
        <Bubble data={data} options={options} />
      </div>

      {/* Legend */}
      <div className="flex justify-evenly mt-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-[#6B21A8]" />
          <span>AI-Generated</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-[#9333EA]" />
          <span>Manual</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-[#A855F7]" />
          <span>Mixed</span>
        </div>
      </div>
    </div>
  );
};

export default CreationMethodDistribution;
