"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IoChevronDownOutline, IoClose } from "react-icons/io5";
import { Checkbox } from "@/components/ui/shadcn-checkbox";
import { Controller } from "react-hook-form";
import { addCriteria, removeCriteria } from "@/redux/slices/criteriaSlice";

interface DropdownSelectProps {
  name: string;
  control: any;
  options: Array<{ label: string; value: string }>;
  selectedCriteria: any;
  tab: string;
  section: string;
  dispatch: any;
  required?: boolean;
  title: string;
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
  name,
  control,
  options,
  selectedCriteria,
  tab,
  section,
  dispatch,
  required,
  title,
}) => {
  const isRequired = selectedCriteria[section]?.values?.length > 0;

  // Helper function to get label from value
  const getLabelFromValue = (value: string): string => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  };

  // Helper function to get value from label (for backward compatibility)
  const getValueFromLabel = (label: string): string => {
    const option = options.find((opt) => opt.label === label);
    return option ? option.value : label;
  };

  const handleCheckboxChange = (
    field: any,
    optionValue: string,
    checked: boolean
  ) => {
    const updatedValues = checked
      ? [...field.value, optionValue]
      : field.value.filter((i: string) => i !== optionValue);

    field.onChange(updatedValues);

    if (checked) {
      dispatch(
        addCriteria({
          tab,
          section,
          criteria: optionValue, // Store value, not label
          required: isRequired,
        })
      );
    } else {
      dispatch(removeCriteria({ tab, section, criteria: optionValue }));
    }
  };

  const removeItem = (field: any, optionValue: string) => {
    const updatedItems = field.value.filter((i: string) => i !== optionValue);
    field.onChange(updatedItems);
    dispatch(removeCriteria({ tab, section, criteria: optionValue }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="w-full flex justify-between items-center pl-10">
        <p className="text-[#333333] text-sm">{title}</p>
      </div>
      <Controller
        name={name}
        control={control}
        defaultValue={[]}
        render={({ field }) => {
          // Debug logging - remove after fixing
          console.log(`${section} field value:`, field.value);

          return (
            <div className="relative w-full h-auto flex flex-col gap-2 pl-10">
              <Checkbox
                className="absolute left-0 top-[30%] -translate-y-1/2"
                checked={selectedCriteria[section]?.values?.length > 0}
              />
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="w-full h-auto border-2 border-[#E0E0E0] text-black text-sm rounded-md py-2 px-3 active:outline-none"
                >
                  <Button
                    variant="outline"
                    size="default"
                    className="w-full flex items-center justify-between"
                  >
                    <span>Select Option</span>
                    <IoChevronDownOutline className="text-[#898989] text-lg" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[450px] flex flex-col">
                  {options.map((option) => (
                    <div
                      key={option.value} // Use value as key for stability
                      className={`items-center gap-2 w-full hover:bg-[#CB85FD1A] px-5 rounded-sm ${
                        option?.value === "other" ? "hidden" : "flex"
                      }`}
                    >
                      <Checkbox
                        id={option.value}
                        checked={field.value?.includes(option.value)} // Check against value
                        onCheckedChange={(checked) => {
                          handleCheckboxChange(field, option.value, !!checked); // Pass value
                        }}
                      />
                      <DropdownMenuLabel className="text-base capitalize font-normal">
                        {option.label} {/* Display label */}
                      </DropdownMenuLabel>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex flex-wrap gap-2">
                {field.value?.map((optionValue: string) => (
                  <div
                    key={optionValue}
                    className="flex items-center gap-1 bg-[#E8DEF8] rounded-xl py-1 px-2"
                  >
                    <span className="text-sm capitalize">
                      {getLabelFromValue(optionValue)}{" "}
                      {/* Display label but store value */}
                    </span>
                    <IoClose
                      className="text-lg cursor-pointer"
                      onClick={() => removeItem(field, optionValue)}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default DropdownSelect;
