import React from "react";
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
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  showLegend = false,
  question,
}) => {

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: showLegend,
      },
      // title: {
      //   display: !!title,
      //   text: title,
      // },
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
   
    barThickness: 40, // Specify the bar thickness (in pixels)
    maxBarThickness: 50, // Maximum bar thickness
  };


  return (
    <div className="border mt-4 w-full rounded-lg shadow-md p-6 bg-white">
      <h3 className="text-gray-700 text-lg font-semibold mb-4">{title}</h3>
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
        <Bar data={data} options={options} className="w-full"/>
      </div>
      </div>
    </div>
  );
};

export default BarChart;
