import React from "react";
import Image from "next/image";
import next from "../../assets/images/nextButton.svg";
import prev from "../../assets/images/prevButton.svg";

interface PaginationControlsProps {
  onPageChange: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  onPageChange,
  setItemsPerPage,
  totalPages,
  currentPage,
  itemsPerPage,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className=" flex items-center gap-5">
        <p className="text-[#333]">Results per page</p>
        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5, 6].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center p-2 ">
        <button
          className="mr-4"
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <Image src={prev} alt="Previous" width={24} height={24} />
        </button>
        <p className="w-[40px] text-[#333333] bg-[#D9DBE9] h-[40px] rounded-[4px] flex items-center justify-center">
          {currentPage}
        </p>
        <button
          className="ml-4"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          <Image src={next} alt="Next" width={24} height={24} />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
