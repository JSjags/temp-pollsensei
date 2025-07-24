import React from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { Button } from "../ui/button";

interface PaginationProps {
  currentSection: number;
  totalSections: number;
  onNavigate: (direction: "next" | "prev") => void;
}

const PaginationBtn: React.FC<PaginationProps> = ({
  currentSection,
  totalSections,
  onNavigate,
}) => {
  // THIS WORKS FINE FOR QUESTION SECTION CONTROLS

  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex items-center gap-6 bg-white/80 backdrop-blur-md dark:bg-zinc-900/80 shadow-lg rounded-full px-2 py-2">
        <Button
          className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition-all duration-200
            ${
              currentSection === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#5B03B2] to-[#9D50BB] text-white hover:from-[#6d28d9] hover:to-[#a78bfa] shadow-md"
            }
          `}
          onClick={(e) => {
            e.preventDefault();
            onNavigate("prev");
          }}
          disabled={currentSection === 0}
          aria-label="Previous Section"
        >
          <MdKeyboardArrowLeft size={22} className="mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <span className="text-lg font-bold tracking-wider text-[#5B03B2] dark:text-[#9D50BB] select-none">
          Section&nbsp;
          <span className="text-2xl">{currentSection + 1}</span>
          <span className="text-base opacity-70">/</span>
          <span className="text-base">{totalSections}</span>
        </span>
        <Button
          className={`flex items-center gap-1 px-4 py-2 rounded-full font-semibold transition-all duration-200
            ${
              currentSection === totalSections - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#9D50BB] to-[#5B03B2] text-white hover:from-[#a78bfa] hover:to-[#6d28d9] shadow-md"
            }
          `}
          onClick={(e) => {
            e.preventDefault();
            onNavigate("next");
          }}
          disabled={currentSection === totalSections - 1}
          aria-label="Next Section"
        >
          <span className="hidden sm:inline">Next</span>
          <MdKeyboardArrowRight size={22} className="ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default PaginationBtn;
