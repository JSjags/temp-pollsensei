import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNavigate: (direction: "next" | "prev") => void;
}
// THIS WORKS FINE FOR PAGES CONTROL

const PageControl: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onNavigate,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          className="flex items-center border rounded-md px-3 bg-[#D9D9D999] py-2"
          onClick={() => onNavigate("prev")}
          disabled={currentPage === 1}
        >
          <MdKeyboardArrowLeft size={20} />
          Prev
        </button>
        <span>
          {currentPage}/{totalPages}
        </span>
        <button
          className="flex items-center border rounded-md px-3 bg-[#D9D9D999] py-2"
          onClick={() => onNavigate("next")}
          disabled={currentPage === totalPages}
        >
          Next <MdKeyboardArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default PageControl;
