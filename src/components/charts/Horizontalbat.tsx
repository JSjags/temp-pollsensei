import React from 'react'

interface HorizontalBarChartProps {
  title: string;
  question: string;
  data: {
    label: string;
    percentage: number;
    color: string;
  }[];
}


const HorizontalBarChart:React.FC<HorizontalBarChartProps> = ({ title, question, data }) => {
  return (
    <div className='mt-4'>
          <div className="border rounded-lg shadow-md p-6 bg-white">
      <h3 className="text-gray-700 text-lg font-semibold mb-4">{title}</h3>
      <p className="text-gray-600 mb-4">{question}</p>

      {data.map((item, index) => (
        <div key={index} className="flex items-center mb-4">
          <div className="flex items-center space-x-2 w-1/3">
            <div className={`w-4 h-4 border-2 rounded-full`} style={{ borderColor: item.color }}></div>
            <span className="text-gray-700">{item.label}</span>
          </div>
          <div className="w-2/3">
            <div className="h-3 rounded-full bg-gray-200 relative">
              <div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default HorizontalBarChart
