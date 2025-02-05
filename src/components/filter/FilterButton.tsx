import React, { useState, useEffect } from "react";
import ButtonAuto from "../common/ButtonAuto";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion"; // Import motion from framer-motion
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "../ui/button";

interface FilterButtonProps {
  text?: string;
  type?: string;
  buttonClassName?: string;
  onClick?: (val: string) => void;
  icon?: React.ReactNode;
  setFilter?: React.Dispatch<React.SetStateAction<string>>;
  onFilterChange?: (status: string) => void;
  currentStatus?: string;
}

const roles = [
  "Admin",
  "Data Collector",
  "Data Validator",
  "Data Analyst",
  "Data Editor",
];

const surveyStatuses = ["On going", "Closed", "Drafts"];

const FilterButton: React.FC<FilterButtonProps> = ({
  onClick,
  text,
  icon,
  buttonClassName,
  setFilter,
  type,
  onFilterChange,
  currentStatus,
}) => {
  const [filterArray, setFilterArray] = useState<string[]>([]);
  const [tempFilterArray, setTempFilterArray] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (type === "survey") {
      const statusParam = searchParams.get("status");
      if (statusParam) {
        const statusArray = [statusParam]; // Only store single status for survey
        setFilterArray(statusArray);
        setTempFilterArray(statusArray);
      } else {
        setFilterArray([]);
        setTempFilterArray([]);
      }
    }
  }, [searchParams, type]);

  const handleShowFilter = () => {
    setShowFilter(!showFilter);
    setTempFilterArray(filterArray);
  };

  const handleClearFilter = () => {
    setFilterArray([]);
    setTempFilterArray([]);
    if (setFilter) {
      setFilter("");
    }
    if (type === "survey") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("status");
      router.push(`${pathname}?${params.toString()}`);
    }
    setShowFilter(false);
  };

  const handleFilterArray = (role: string) => {
    if (type === "survey") {
      // For survey, only allow one selection
      setTempFilterArray([role]);
    } else {
      setTempFilterArray((prevArray) => {
        return prevArray.includes(role)
          ? prevArray.filter((item) => item !== role)
          : [...prevArray, role];
      });
    }
  };

  const handleApplyFilter = () => {
    setFilterArray(tempFilterArray);
    if (type === "survey") {
      const params = new URLSearchParams(searchParams.toString());
      if (tempFilterArray.length > 0) {
        params.set("status", tempFilterArray[0]); // Only use first status for survey
      } else {
        params.delete("status");
      }
      router.push(`${pathname}?${params.toString()}`);
    }
    onClick && onClick(tempFilterArray.join(","));
    setShowFilter(false);
  };

  const handleStatusSelect = (status: string) => {
    onFilterChange?.(status);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".filter-button-container")) {
        setShowFilter(false);
        setTempFilterArray(filterArray);
      }
    };

    if (showFilter) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showFilter, filterArray]);

  const options = type === "survey" ? surveyStatuses : roles;

  return (
    <div className="relative filter-button-container">
      <motion.button
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={handleShowFilter}
        className={cn(
          `flex items-center justify-center text-[16px] rounded-[6px] px-[10px] py-[11px] h-[40px] border-[1px] border-[#9D50BB] ${
            filterArray.length > 0 ? "text-[#9D50BB]" : "text-[#333]"
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
        {filterArray.length > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="ml-2 size-5 text-white font-semibold flex items-center justify-center rounded-full bg-gradient-to-r from-[#5B03B2] to-[#9D50BB]"
          >
            {filterArray.length}
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
            className="absolute shadow-lg z-[50] top-[60px] left-0 w-[95vw] max-w-[344px] h-fit rounded-[20px] border-[#D9D9D9] border-[1px] bg-white"
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
                {tempFilterArray.length}
              </motion.span>
              <p className="pl-2">
                {"   "}
                {type === "survey" ? "status" : "roles"}
              </p>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="px-[30px] py-[20px] flex flex-col gap-5"
            >
              {options.map((option, i) => (
                <motion.div
                  key={option}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <input
                    onClick={() => handleFilterArray(option)}
                    className="accent-[#9D50BB] accent-text-red-300 cursor-pointer"
                    type="checkbox"
                    checked={tempFilterArray.includes(option)}
                  />
                  <label className="text-[16px] text-[#333333] font-normal">
                    {option}
                  </label>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-3 mt-4 mb-2 px-[30px]"
            >
              <Button
                onClick={handleClearFilter}
                variant="ghost"
                className="text-[16px]"
              >
                Clear
              </Button>

              <ButtonAuto label="Filter" onClick={handleApplyFilter} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterButton;
