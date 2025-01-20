import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Button } from "@/components/ui/button";

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
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({
  title,
  options,
  multiSelect = false,
  applyLabel = "Apply Now",
  onApply,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleOptionClick = (option: string) => {
    if (multiSelect) {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter((opt:any) => opt !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    } else {
      setSelectedOptions([option]);
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
        <button className="py-2 px-4 bg-white border border-gray-300 flex items-center text-sm">
          <span className="mr-2">{title}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12L12 17.25 17.25 12m-11.5-6.75L12 6.75 17.25 12"
            />
          </svg>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 z-[10000] p-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium">{title} Type</h3>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {options?.map((option) => (
            <button
              key={option.value}
              className={`py-1 px-4 border rounded-full ${
                selectedOptions.includes(option.value)
                  ? "bg-purple-500 text-white"
                  : "border-gray-300 text-gray-600"
              }`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mb-4">
          {multiSelect
            ? "*You can choose multiple options"
            : "*You can only choose one option"}
        </p>
        <Button
          onClick={handleApply}
          className="w-full bg-purple-600 text-white"
        >
          {applyLabel}
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownFilter;