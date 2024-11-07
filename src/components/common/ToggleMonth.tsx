import React, { useState } from 'react';

interface ToggleProps {
  onToggle: (isMonthly: boolean) => void;
}

const ToggleMonth: React.FC<ToggleProps> = ({ onToggle }) => {
  const [isMonthly, setIsMonthly] = useState(true);

  const handleToggle = () => {
    setIsMonthly(!isMonthly);
    onToggle(!isMonthly);
  };

  return (
    <div className="flex items-center p-1 bg-purple-100 rounded-full w-40">
      <button
        onClick={handleToggle}
        className={`flex-1 text-center py-2 px-3 rounded-full transition-colors duration-500 ${
          isMonthly ? 'bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white' : 'text-gray-600'
        }`}
      >
        Monthly
      </button>
      <button
        onClick={handleToggle}
        className={`flex-1 text-center py-2 px-3 rounded-full transition-colors duration-500 ${
          !isMonthly ? 'bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white' : 'text-gray-600'
        }`}
      >
        Yearly
      </button>
    </div>
  );
};

export default ToggleMonth;
