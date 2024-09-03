import React, { useState, useEffect } from "react";
import ButtonAuto from "../common/ButtonAuto";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion"; // Import motion from framer-motion

interface FilterButtonProps {
  text: string;
  buttonClassName?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  text,
  icon,
  buttonClassName,
}) => {
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
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={handleShowFilter}
        className={cn(
          `flex items-center justify-center text-[16px] rounded-[6px] px-[10px] py-[11px] h-[40px] border-[1px] border-[#9D50BB] ${
            count > 0 ? "text-[#9D50BB]" : "text-[#333]"
          }`,
          buttonClassName
        )}
      >
        <motion.span
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden sm:inline-block mr-3"
        >
          {text}
        </motion.span>{" "}
        <motion.span
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className=""
        >
          {icon}
        </motion.span>
        {count > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="ml-2 w-[28px] h-[28px] text-white font-semibold flex items-center justify-center rounded-full bg-gradient-to-r from-[#5B03B2] via-violet-600 to-[#9D50BB]"
          >
            {count}
          </motion.span>
        )}
      </motion.button>
      <AnimatePresence>
        {showFilter && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute shadow-lg z-[50] top-[60px] left-0 w-[95vw] max-w-[344px] h-[307px] rounded-[20px] border-[#D9D9D9] border-[1px] bg-white"
          >
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="border-b-[1px] px-[30px] py-[10px] text-[#333] flex"
            >
              Filter by
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="ml-2 w-[28px] h-[28px] text-[#333333] font-semibold flex items-center justify-center rounded-full bg-[#f2f2f2]"
              >
                {count}
              </motion.span>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="px-[30px] py-[20px] flex flex-col gap-5"
            >
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-3"
              >
                <input
                  onClick={handleFilterArray}
                  className="accent-[#9D50BB] accent-text-red-300"
                  type="checkbox"
                  defaultChecked
                />
                <label className="text-[16px] text-[#333333] font-normal">
                  Drafts
                </label>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center gap-3"
              >
                <input
                  onClick={handleFilterArray}
                  className="accent-[#9D50BB] accent-text-red-300"
                  type="checkbox"
                />
                <label className="text-[16px] text-[#333333] font-normal">
                  Ongoing
                </label>
              </motion.div>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-3"
              >
                <input
                  onClick={handleFilterArray}
                  className="accent-[#9D50BB] accent-text-red-300"
                  type="checkbox"
                />
                <label className="text-[16px] text-[#333333] font-normal">
                  Closed
                </label>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-3 mt-[25px]"
            >
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterButton;
