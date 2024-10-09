import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  title: string;
  question: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

const LineChart: React.FC<LineChartProps> = ({ title, question, labels, datasets }) => {
  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="border mt-4 w-full rounded-lg shadow-md p-6 bg-white">
      <h3 className="text-gray-700 text-lg font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{question}</p>
      <div className="flex justify-center h-48 border w-full">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default LineChart;
