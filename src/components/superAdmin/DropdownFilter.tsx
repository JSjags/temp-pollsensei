import React, { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Search } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface DropdownFilterProps {
  title: string;
  options: FilterOption[];
  multiSelect?: boolean;
  applyLabel?: string;
  onApply?: (selectedOptions: string[]) => void;
  selected?: string;
  className?: string;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  title,
  options,
  multiSelect = false,
  applyLabel = "Apply Now",
  onApply,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handleOptionClick = (option: string) => {
    if (multiSelect) {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(
          selectedOptions.filter((opt: any) => opt !== option)
        );
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      setSelectedOptions([option]);
    }
  };

  const handleClearSelection = () => {
    setSelectedOptions([]);
    if (onApply) {
      onApply([]);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selectedOptions);
    }
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`
            relative py-2.5 px-4 bg-white border border-gray-300 
            hover:border-purple-400 hover:bg-purple-50/50 
            transition-all duration-200 ease-in-out
            rounded-lg flex items-center justify-between
            text-sm font-medium min-w-[180px] max-w-full
            focus:outline-none focus:ring-2 focus:ring-purple-500/20
            ${
              selectedOptions.length > 0
                ? "text-purple-600 border-purple-400"
                : "text-gray-700"
            }
            ${className}
          `}
        >
          <span className="mr-2 overflow-hidden text-ellipsis whitespace-nowrap">
            {selectedOptions.length > 0
              ? `${title} (${selectedOptions.length})`
              : title}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[min(calc(100vw-2rem),400px)] z-[10000] p-4 rounded-xl shadow-lg"
        align="start"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {selectedOptions.length > 0 && (
              <button
                onClick={handleClearSelection}
                className="text-sm text-gray-500 hover:text-purple-600 transition-colors duration-200"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400
                placeholder:text-gray-400"
            />
          </div>

          {/* Options Container with Scroll */}
          <div className="max-h-[300px] overflow-y-auto mb-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
            <div className="grid grid-cols-1 gap-2">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = selectedOptions.includes(option.value);
                  return (
                    <motion.button
                      key={option.value}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative py-2.5 px-4 border rounded-lg text-sm font-medium
                        transition-all duration-200 flex items-center
                        min-h-[40px] w-full text-left
                        ${
                          isSelected
                            ? "bg-purple-50 border-purple-500 text-purple-700"
                            : "border-gray-200 text-gray-600 hover:border-purple-400 hover:bg-purple-50/50"
                        }
                      `}
                      onClick={() => handleOptionClick(option.value)}
                    >
                      {isSelected && (
                        <Check className="w-4 h-4 absolute left-3 text-purple-600" />
                      )}
                      <span className={`${isSelected ? "pl-8" : ""}`}>
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
          </div>

          {/* Selection Info */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <p className="text-gray-500">
              {multiSelect ? "Select multiple options" : "Select one option"}
            </p>
            {selectedOptions.length > 0 && (
              <p className="text-purple-600 font-medium">
                {selectedOptions.length} selected
              </p>
            )}
          </div>

          <Button
            onClick={handleApply}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white 
              py-2.5 rounded-lg font-medium transition-all duration-200
              focus:ring-4 focus:ring-purple-500/20"
          >
            {applyLabel}
          </Button>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownFilter;
