import React from "react";
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
}

const Piechart: React.FC<PieChartProps> = ({ data, title, question }) => {
  const options = {
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
  };
  return (
    <div className="border rounded-lg shadow-md p-6 bg-white mt-4">
      <h3 className="text-gray-700 text-lg font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{question}</p>

      <div className="flex justify-between gap-5 items-start">
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
                {label} : <span className="ml-5">{data.datasets[0].data[index]?.toFixed(2)}%</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-1  h-56">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Piechart;
