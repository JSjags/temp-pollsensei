import React, { useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onNavigate: (direction: "next" | "prev") => void;
  onPageChange?: (page: number) => void;
}

const PageControl: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onNavigate,
  isLoading = false,
  onPageChange,
}) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());

  React.useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");
    // If value is greater than totalPages, set to totalPages immediately
    if (value) {
      let num = parseInt(value, 10);
      if (num > totalPages) {
        value = totalPages.toString();
      }
    }
    setInputPage(value);
  };

  const handleInputBlurOrEnter = () => {
    let pageNum = parseInt(inputPage, 10);
    if (isNaN(pageNum)) {
      setInputPage(currentPage.toString());
      return;
    }
    if (pageNum < 1) pageNum = 1;
    if (pageNum > totalPages) pageNum = totalPages;
    if (pageNum !== currentPage && onPageChange) {
      onPageChange(pageNum);
    } else {
      setInputPage(currentPage.toString());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-4">
        <motion.button
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 text-sm sm:text-base
            ${
              currentPage === 1 || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow"
            }`}
          onClick={() => !isLoading && onNavigate("prev")}
          disabled={isLoading || currentPage === 1}
        >
          <MdKeyboardArrowLeft size={20} />
          <span className="font-medium hidden sm:inline">Previous</span>
        </motion.button>

        <div className="flex items-center justify-center bg-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg shadow-sm border border-gray-200 text-sm sm:text-base">
          <motion.span
            key={currentPage}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`font-semibold ${
              isLoading ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Page
            <input
              type="number"
              min={1}
              max={totalPages}
              value={inputPage}
              onChange={handleInputChange}
              onBlur={handleInputBlurOrEnter}
              onKeyDown={handleInputKeyDown}
              disabled={isLoading}
              className={`mx-1 w-12 text-center border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                isLoading
                  ? "bg-gray-100 text-gray-400"
                  : "bg-white text-gray-700"
              }`}
              style={{ MozAppearance: "textfield" }}
            />
            of {totalPages}
          </motion.span>
        </div>

        <motion.button
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-all duration-300 text-sm sm:text-base
            ${
              currentPage === totalPages || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow"
            }`}
          onClick={() => !isLoading && onNavigate("next")}
          disabled={isLoading || currentPage === totalPages}
        >
          <span className="font-medium hidden sm:inline">Next</span>
          <MdKeyboardArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  );
};

export default PageControl;
