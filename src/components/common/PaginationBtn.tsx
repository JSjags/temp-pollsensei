import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface PaginationProps {
  currentSection: number;
  totalSections: number;
  onNavigate: (direction: "next" | "prev") => void;
}

const PaginationBtn:React.FC<PaginationProps>  = ({
  currentSection,
  totalSections,
  onNavigate,
}) => {

  
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          className="flex items-center border rounded-md px-3 bg-[#D9D9D999] py-2"
          onClick={() => onNavigate("prev")}
          disabled={currentSection === 0}
        >
          <MdKeyboardArrowLeft size={20} />
          Prev
        </button>
        <span>
          {currentSection + 1}/{totalSections}
        </span>
        <button
          className="flex items-center border rounded-md px-3 bg-[#D9D9D999] py-2"
          onClick={() => onNavigate("next")}
          disabled={currentSection === totalSections - 1}
        >
          Next <MdKeyboardArrowRight size={20} />
        </button>
      </div>
    </div>
  )
}

export default PaginationBtn
