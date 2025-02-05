import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onNavigate: (direction: "next" | "prev") => void;
}

const PageControl: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onNavigate,
  isLoading = false,
}) => {
  console.log(isLoading);

  // The buttons were not properly disabled because the disabled prop was only being set based on
  // currentPage position, and isLoading was only used in the className and click handler.
  // To properly disable the buttons when loading, we need to include isLoading in the disabled prop condition.
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300 
            ${
              currentPage === 1 || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow"
            }`}
          onClick={() => !isLoading && onNavigate("prev")}
          disabled={isLoading || currentPage === 1}
        >
          <MdKeyboardArrowLeft size={24} />
          <span className="font-medium">Previous</span>
        </motion.button>

        <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <motion.span
            key={currentPage}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`font-semibold ${
              isLoading ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Page {currentPage} of {totalPages}
          </motion.span>
        </div>

        <motion.button
          whileHover={!isLoading ? { scale: 1.05 } : {}}
          whileTap={!isLoading ? { scale: 0.95 } : {}}
          className={`flex items-center gap-1 px-4 py-2 rounded-lg transition-all duration-300
            ${
              currentPage === totalPages || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm hover:shadow"
            }`}
          onClick={() => !isLoading && onNavigate("next")}
          disabled={isLoading || currentPage === totalPages}
        >
          <span className="font-medium">Next</span>
          <MdKeyboardArrowRight size={24} />
        </motion.button>
      </div>
    </div>
  );
};

export default PageControl;
