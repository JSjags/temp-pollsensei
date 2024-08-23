import React, { useState } from "react";
import ButtonAuto from "../common/ButtonAuto";

interface FilterButtonProps {
  text: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onClick, text, icon }) => {
  const [count, setCount] = useState<number>(0);
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);

  const handleShowFilter = () => {
    console.log("filtering");
    setShowFilter(!showFilter);
    // onClick();
  };

  const handleClearFilter = () => {
    setShowFilter(false);
    setCount(0);
  };

  const handleFilterArray = () => {
    setCount(count + 1);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShowFilter}
        className={`flex items-center justify-center text-[16px] rounded-[6px] px-[10px] py-[11px] h-[40px] border-[1px] border-[#9D50BB] ${
          count > 0 ? "text-[#9D50BB]" : "text-[#333]"
        }`}
      >
        {text} <span className="ml-3">{icon}</span>
        {count > 0 && (
          <span className="ml-2 w-[28px] h-[28px] text-white font-semibold flex items-center justify-center rounded-full bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]">
            {count}
          </span>
        )}
      </button>
      {showFilter && (
        <div className="absolute z-[50] top-[60px] left-0 w-[344px] h-[307px] rounded-[20px] border-[#D9D9D9] border-[1px] bg-white">
          <div className="border-b-[1px] px-[30px] py-[10px] text-[#333] flex">
            Filter by
            <span className="ml-2 w-[28px] h-[28px] text-[#333333] font-semibold flex items-center justify-center rounded-full bg-[#f2f2f2]">
              {count}
            </span>
          </div>
          <div className="px-[30px] py-[20px] flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <input
                onClick={handleFilterArray}
                className="accent-[#9D50BB] accent-text-red-300"
                type="checkbox"
                defaultChecked
              />
              <label className="text-[16px] text-[#333333] font-normal">
                Drafts
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                onClick={handleFilterArray}
                className="accent-[#9D50BB] accent-text-red-300"
                type="checkbox"
              />
              <label className="text-[16px] text-[#333333] font-normal">
                Ongoing
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                onClick={handleFilterArray}
                className="accent-[#9D50BB] accent-text-red-300"
                type="checkbox"
              />
              <label className="text-[16px] text-[#333333] font-normal">
                Closed
              </label>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-[25px]">
            <button
              onClick={handleClearFilter}
              className="flex items-center justify-center text-[#333333] text-[16px] rounded-[6px] px-[24px] py-[16px] max-h-[52px]"
            >
              Clear
            </button>

            <ButtonAuto label="Filter" onClick={onClick} />
            {/* <button
              onClick={onClick}
              className="flex items-center justify-center text-white text-[16px] rounded-[6px] px-[24px] py-[16px] h-[40px] bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
            >
              Filter
            </button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterButton;
